import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename) {
    return new NextResponse("Filename required", { status: 400 });
  }

  const safeFilename = path.basename(filename);
  const ext = path.extname(safeFilename).toLowerCase();
  const defaultContentType = EXTENSION_TO_MIME[ext] || "image/jpeg";

  // 1. Check local public/uploads directory (Local development)
  try {
    const diskPath = path.join(process.cwd(), "public", "uploads", safeFilename);
    if (fs.existsSync(diskPath)) {
      const buffer = await fs.promises.readFile(diskPath);
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": defaultContentType,
          "Content-Length": String(buffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch {}

  // 2. Check /tmp/kradind_uploads cache (Serverless writable cache)
  try {
    const tmpPath = path.join("/tmp", "kradind_uploads", safeFilename);
    if (fs.existsSync(tmpPath)) {
      const buffer = await fs.promises.readFile(tmpPath);
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": defaultContentType,
          "Content-Length": String(buffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch {}

  // 3. Fetch from MongoDB Atlas (Persisted across serverless restarts and Vercel builds)
  try {
    const db = await getDb();
    const doc = await db.collection("media_uploads").findOne({ filename: safeFilename });

    if (doc) {
      let buffer: Buffer | null = null;

      if (doc.dataBase64) {
        buffer = Buffer.from(doc.dataBase64, "base64");
      } else if (doc.data) {
        if (doc.data.buffer) {
          buffer = Buffer.from(doc.data.buffer);
        } else if (Buffer.isBuffer(doc.data)) {
          buffer = doc.data;
        } else {
          buffer = Buffer.from(doc.data);
        }
      }

      if (buffer && buffer.length > 0) {
        // Cache in /tmp for sub-millisecond future responses
        try {
          const tmpDir = path.join("/tmp", "kradind_uploads");
          if (!fs.existsSync(tmpDir)) {
            await fs.promises.mkdir(tmpDir, { recursive: true });
          }
          await fs.promises.writeFile(path.join(tmpDir, safeFilename), buffer);
        } catch {}

        const contentType = doc.contentType || defaultContentType;
        return new NextResponse(new Uint8Array(buffer), {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Length": String(buffer.length),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }
  } catch (err) {
    console.error("Error fetching media from MongoDB Atlas:", err);
  }

  return new NextResponse("Image not found", { status: 404 });
}
