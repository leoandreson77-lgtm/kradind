import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getAdminSession } from "@/lib/admin-auth";

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
 * GET: List all uploaded media files
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const uploadDir = getUploadDir();
    if (!fs.existsSync(uploadDir)) {
      return NextResponse.json({ files: [] });
    }

    const fileNames = await fs.promises.readdir(uploadDir);
    const files = await Promise.all(
      fileNames
        .filter((fn) => !fn.startsWith("."))
        .map(async (fn) => {
          try {
            const filePath = path.join(uploadDir, fn);
            const stats = await fs.promises.stat(filePath);
            return {
              url: `/uploads/${fn}`,
              filename: fn,
              size: stats.size,
              createdAt: stats.birthtime.toISOString(),
            };
          } catch {
            return null;
          }
        })
    );

    const validFiles = files.filter(Boolean).sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ files: validFiles });
  } catch (error: any) {
    console.error("Failed to list uploaded files:", error);
    return NextResponse.json({ error: "Failed to read upload directory" }, { status: 500 });
  }
}

/**
 * POST: Upload one or more image files
 */
export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json(
      {
        error: "Unauthorized access: Admin session is missing, invalid or expired. Please re-login.",
        authenticated: false,
      },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No file provided in form-data" }, { status: 400 });
    }

    const uploadDir = getUploadDir();
    if (!fs.existsSync(uploadDir)) {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles: Array<{ url: string; filename: string; size: number; type: string }> = [];

    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
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
      const filePath = path.join(uploadDir, safeFilename);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.promises.writeFile(filePath, buffer);

      uploadedFiles.push({
        url: `/uploads/${safeFilename}`,
        filename: safeFilename,
        size: file.size,
        type: file.type,
      });
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json({ error: "No valid image files were processed" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: uploadedFiles[0].url,
      filename: uploadedFiles[0].filename,
      size: uploadedFiles[0].size,
      type: uploadedFiles[0].type,
      files: uploadedFiles,
      urls: uploadedFiles.map((f) => f.url),
    }, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during upload" },
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

    // Guard against path traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(getUploadDir(), safeFilename);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    return NextResponse.json({ success: true, message: "File removed" });
  } catch (error: any) {
    console.error("Delete file error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
