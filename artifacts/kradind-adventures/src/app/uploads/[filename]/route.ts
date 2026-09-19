import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename) {
    return new NextResponse("Filename required", { status: 400 });
  }

  const safeFilename = path.basename(filename);

  // 1. Check if file is available on local disk
  try {
    const diskPath = path.join(process.cwd(), "public", "uploads", safeFilename);
    if (fs.existsSync(diskPath)) {
      const buffer = await fs.promises.readFile(diskPath);
      const ext = path.extname(safeFilename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".avif": "image/avif",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(buffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch {}

  // 2. Fetch from MongoDB Atlas (persisted across Vercel deployments & serverless runs)
  try {
    const db = await getDb();
    const doc = await db.collection("media_uploads").findOne({ filename: safeFilename });

    if (doc && doc.data) {
      const rawData = doc.data;
      const buffer = Buffer.isBuffer(rawData)
        ? rawData
        : rawData.buffer
        ? Buffer.from(rawData.buffer)
        : Buffer.from(rawData);

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": doc.contentType || "image/jpeg",
          "Content-Length": String(buffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (err) {
    console.error("Error fetching media from MongoDB:", err);
  }

  return new NextResponse("Image not found", { status: 404 });
}
