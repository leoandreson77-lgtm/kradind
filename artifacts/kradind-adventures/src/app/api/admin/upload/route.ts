import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 60;

// Maximum allowed payload limit on server (25MB)
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

const EXTENSION_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".pjpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/jfif",
  "image/pjpeg",
  "image/png",
  "image/x-png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "image/bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/heic",
  "image/heif",
  "application/octet-stream",
]);

function getPublicUploadDir(): string {
  return path.join(process.cwd(), "public", "uploads");
}

function getTmpUploadDir(): string {
  return path.join("/tmp", "kradind_uploads");
}

function resolveMimeType(filename: string, declaredType?: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (EXTENSION_TO_MIME[ext]) {
    return EXTENSION_TO_MIME[ext];
  }
  const cleanDeclared = (declaredType || "").toLowerCase().trim();
  if (cleanDeclared && cleanDeclared !== "application/octet-stream" && cleanDeclared.startsWith("image/")) {
    return cleanDeclared;
  }
  return "image/jpeg";
}

function generateSafeFilename(originalName: string, mimeType: string): string {
  let ext = path.extname(originalName).toLowerCase();
  if (!ext || !EXTENSION_TO_MIME[ext]) {
    const mimeMap: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/avif": ".avif",
      "image/gif": ".gif",
      "image/svg+xml": ".svg",
      "image/bmp": ".bmp",
    };
    ext = mimeMap[mimeType] || ".jpg";
  }

  const baseName = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .slice(0, 40)
    .replace(/^-+|-+$/g, "");

  const randomHash = crypto.randomBytes(4).toString("hex");
  return `${Date.now()}-${randomHash}-${baseName || "photo"}${ext}`;
}

async function persistFile(
  safeFilename: string,
  buffer: Buffer,
  mimeType: string,
  db: any
): Promise<boolean> {
  let stored = false;

  // 1. Store in MongoDB Atlas (Persisted across serverless restarts and Vercel builds)
  if (db) {
    try {
      await db.collection("media_uploads").updateOne(
        { filename: safeFilename },
        {
          $set: {
            filename: safeFilename,
            contentType: mimeType,
            size: buffer.length,
            data: buffer,
            dataBase64: buffer.toString("base64"),
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
      stored = true;
    } catch (mongoErr) {
      console.error("Failed saving image to MongoDB Atlas:", mongoErr);
    }
  }

  // 2. Cache in /tmp directory (Always writable on Vercel / AWS Lambda / Linux)
  try {
    const tmpDir = getTmpUploadDir();
    if (!fs.existsSync(tmpDir)) {
      await fs.promises.mkdir(tmpDir, { recursive: true });
    }
    await fs.promises.writeFile(path.join(tmpDir, safeFilename), buffer);
    stored = true;
  } catch (tmpErr) {
    // Ignore tmp write warnings
  }

  // 3. Write to public/uploads (Writable in local dev environment)
  try {
    const publicDir = getPublicUploadDir();
    if (!fs.existsSync(publicDir)) {
      await fs.promises.mkdir(publicDir, { recursive: true });
    }
    await fs.promises.writeFile(path.join(publicDir, safeFilename), buffer);
    stored = true;
  } catch (fsErr: any) {
    // EROFS is expected on Vercel read-only filesystem, ignore if stored in Mongo or tmp
    if (fsErr?.code !== "EROFS" && !stored) {
      console.warn("Public directory write notice:", fsErr);
    }
  }

  return stored;
}

/**
 * GET: List all uploaded media files from MongoDB Atlas and local disk
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access: Session expired. Please re-login." }, { status: 401 });
  }

  try {
    const fileMap = new Map<string, { url: string; filename: string; size: number; createdAt: string }>();

    // 1. Fetch from MongoDB Atlas
    try {
      const db = await getDb();
      const docs = await db
        .collection("media_uploads")
        .find({}, { projection: { filename: 1, size: 1, contentType: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();

      for (const doc of docs) {
        if (doc.filename) {
          fileMap.set(doc.filename, {
            url: `/uploads/${doc.filename}`,
            filename: doc.filename,
            size: doc.size || 0,
            createdAt: doc.createdAt || new Date().toISOString(),
          });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB listing warning (falling back to disk):", dbErr);
    }

    // 2. Fetch from local public/uploads directory if present
    try {
      const uploadDir = getPublicUploadDir();
      if (fs.existsSync(uploadDir)) {
        const diskFiles = await fs.promises.readdir(uploadDir);
        for (const fn of diskFiles) {
          if (!fn.startsWith(".") && !fileMap.has(fn)) {
            try {
              const filePath = path.join(uploadDir, fn);
              const stats = await fs.promises.stat(filePath);
              fileMap.set(fn, {
                url: `/uploads/${fn}`,
                filename: fn,
                size: stats.size,
                createdAt: stats.birthtime.toISOString(),
              });
            } catch {}
          }
        }
      }
    } catch {}

    const validFiles = Array.from(fileMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ files: validFiles });
  } catch (error: any) {
    console.error("Failed to list uploaded files:", error);
    return NextResponse.json({ error: "Failed to read uploaded files" }, { status: 500 });
  }
}

/**
 * POST: Upload one or more images
 * Accepts both multipart/form-data (FormData) and application/json (Base64 data-uris)
 */
export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json(
      {
        error: "Admin authentication required. Please re-login to the admin portal.",
        authenticated: false,
      },
      { status: 401 }
    );
  }

  let db: any = null;
  try {
    db = await getDb();
  } catch (dbErr) {
    console.warn("MongoDB connection warning in upload route:", dbErr);
  }

  const contentType = request.headers.get("content-type") || "";
  const uploadedFiles: Array<{ url: string; filename: string; size: number; type: string }> = [];

  try {
    // ---------------------------------------------------------
    // CASE A: JSON body with Base64 payload
    // ---------------------------------------------------------
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const rawImages: Array<{ image?: string; data?: string; base64?: string; filename?: string; type?: string }> = [];

      if (Array.isArray(body.images)) {
        rawImages.push(...body.images);
      } else if (body.image || body.data || body.base64) {
        rawImages.push(body);
      }

      for (const item of rawImages) {
        const payloadStr = item.image || item.data || item.base64 || "";
        if (!payloadStr) continue;

        let mimeType = item.type || "image/jpeg";
        let base64Data = payloadStr;

        const dataUriMatch = payloadStr.match(/^data:([^;]+);base64,(.+)$/);
        if (dataUriMatch) {
          mimeType = dataUriMatch[1];
          base64Data = dataUriMatch[2];
        }

        const buffer = Buffer.from(base64Data, "base64");
        if (buffer.length > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { error: `Image exceeds maximum allowed size limit of 25MB.` },
            { status: 400 }
          );
        }

        const safeFilename = generateSafeFilename(item.filename || "upload.jpg", mimeType);
        await persistFile(safeFilename, buffer, mimeType, db);

        uploadedFiles.push({
          url: `/uploads/${safeFilename}`,
          filename: safeFilename,
          size: buffer.length,
          type: mimeType,
        });
      }
    }
    // ---------------------------------------------------------
    // CASE B: multipart/form-data
    // ---------------------------------------------------------
    else {
      const formData = await request.formData();
      
      const rawList: any[] = [
        ...formData.getAll("file"),
        ...formData.getAll("files"),
        ...formData.getAll("image"),
        ...formData.getAll("images"),
      ];

      const files: File[] = rawList.filter((f) => f && typeof f !== "string" && f.name);

      if (files.length === 0) {
        return NextResponse.json(
          { error: "No image file received. Please select a valid photo file." },
          { status: 400 }
        );
      }

      for (const file of files) {
        const declaredType = file.type?.toLowerCase() || "";
        const ext = path.extname(file.name).toLowerCase();
        const mimeType = resolveMimeType(file.name, declaredType);

        const isMimeAllowed = ALLOWED_MIME_TYPES.has(mimeType) || Boolean(EXTENSION_TO_MIME[ext]);
        if (!isMimeAllowed) {
          return NextResponse.json(
            {
              error: `Unsupported file format "${file.name}". Please upload a JPG, PNG, WEBP, AVIF, or SVG image.`,
            },
            { status: 400 }
          );
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
          return NextResponse.json(
            { error: `File "${file.name}" exceeds maximum allowed limit of 25MB.` },
            { status: 400 }
          );
        }

        const safeFilename = generateSafeFilename(file.name, mimeType);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await persistFile(safeFilename, buffer, mimeType, db);

        uploadedFiles.push({
          url: `/uploads/${safeFilename}`,
          filename: safeFilename,
          size: buffer.length,
          type: mimeType,
        });
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: "No valid image files could be processed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        url: uploadedFiles[0].url,
        filename: uploadedFiles[0].filename,
        size: uploadedFiles[0].size,
        type: uploadedFiles[0].type,
        files: uploadedFiles,
        urls: uploadedFiles.map((f) => f.url),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to complete image upload" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove an uploaded file
 */
export async function DELETE(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json({ error: "Missing filename parameter" }, { status: 400 });
    }

    const safeFilename = path.basename(filename);

    // 1. Remove from MongoDB Atlas
    try {
      const db = await getDb();
      await db.collection("media_uploads").deleteOne({ filename: safeFilename });
    } catch (dbErr) {
      console.warn("Error removing from MongoDB Atlas:", dbErr);
    }

    // 2. Remove from /tmp
    try {
      const tmpPath = path.join(getTmpUploadDir(), safeFilename);
      if (fs.existsSync(tmpPath)) {
        await fs.promises.unlink(tmpPath);
      }
    } catch {}

    // 3. Remove from public/uploads
    try {
      const filePath = path.join(getPublicUploadDir(), safeFilename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch {}

    return NextResponse.json({ success: true, message: "File removed" });
  } catch (error: any) {
    console.error("Delete file error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
