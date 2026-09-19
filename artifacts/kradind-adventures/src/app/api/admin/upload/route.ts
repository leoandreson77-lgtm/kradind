import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

function getUploadDir(): string {
  return path.join(process.cwd(), "public", "uploads");
}

/**
 * GET: List all uploaded media files from MongoDB (and local disk if available)
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const fileMap = new Map<string, { url: string; filename: string; size: number; createdAt: string }>();

    // 1. Fetch from MongoDB Atlas (persistent on Vercel / serverless)
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

    // 2. Fetch from local disk if writable/present
    try {
      const uploadDir = getUploadDir();
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
 * POST: Upload one or more image files
 * Stores to MongoDB Atlas to support read-only / serverless filesystems (e.g. Vercel EROFS),
 * while also attempting to write to local disk if available.
 */
export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json(
      {
        error: "Unauthorized access: Admin session is missing, invalid or expired. Please re-login.",
        authenticated: false,
      },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No file provided in form-data" }, { status: 400 });
    }

    const uploadedFiles: Array<{ url: string; filename: string; size: number; type: string }> = [];

    // Connect to MongoDB Atlas
    let db: any = null;
    try {
      db = await getDb();
    } catch (dbErr) {
      console.error("Failed to connect to MongoDB for upload:", dbErr);
    }

    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      const mimeType = file.type?.toLowerCase() || "image/jpeg";
      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        return NextResponse.json(
          {
            error: `Unsupported file type "${file.type}". Allowed types: JPG, PNG, WEBP, AVIF, GIF, SVG.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds maximum allowed limit of 15MB.` },
          { status: 400 }
        );
      }

      // Generate a clean safe filename
      const originalExt = path.extname(file.name) || ".jpg";
      const baseName = path
        .basename(file.name, originalExt)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 40)
        .replace(/^-+|-+$/g, "");

      const randomHash = crypto.randomBytes(4).toString("hex");
      const safeFilename = `${Date.now()}-${randomHash}-${baseName || "photo"}${originalExt.toLowerCase()}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 1. Store into MongoDB Atlas (works seamlessly on Vercel / serverless)
      let storedInMongo = false;
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
                createdAt: new Date().toISOString(),
              },
            },
            { upsert: true }
          );
          storedInMongo = true;
        } catch (mongoSaveErr) {
          console.error("Failed saving image to MongoDB:", mongoSaveErr);
        }
      }

      // 2. Also try writing to local disk (ignore EROFS on read-only environments like Vercel)
      try {
        const uploadDir = getUploadDir();
        if (!fs.existsSync(uploadDir)) {
          await fs.promises.mkdir(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, safeFilename);
        await fs.promises.writeFile(filePath, buffer);
      } catch (fsErr: any) {
        // If filesystem is read-only (EROFS) and we saved to MongoDB, this is expected on Vercel!
        if (fsErr?.code !== "EROFS" && !storedInMongo) {
          console.error("Filesystem write error:", fsErr);
          throw fsErr;
        }
      }

      uploadedFiles.push({
        url: `/uploads/${safeFilename}`,
        filename: safeFilename,
        size: file.size,
        type: mimeType,
      });
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json({ error: "No valid image files were processed" }, { status: 400 });
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
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during upload" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove an uploaded file from MongoDB and local disk
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

    // 1. Remove from MongoDB
    try {
      const db = await getDb();
      await db.collection("media_uploads").deleteOne({ filename: safeFilename });
    } catch (dbErr) {
      console.warn("Error removing from MongoDB:", dbErr);
    }

    // 2. Remove from disk if present
    try {
      const filePath = path.join(getUploadDir(), safeFilename);
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
