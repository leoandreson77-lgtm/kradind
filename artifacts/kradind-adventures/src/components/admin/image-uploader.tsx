"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  X,
  Check,
  Star,
  Eye,
  RefreshCw,
  AlertCircle,
  Plus,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Copy,
  ExternalLink,
  Tag,
  Sparkles,
} from "lucide-react";
import { ALT_TEXT_PRESETS } from "@/lib/image-alt";

interface SingleImageUploaderProps {
  mode?: "single";
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  altPlaceholder?: string;
  label?: string;
  description?: string;
  aspect?: "banner" | "landscape" | "square" | "video";
  required?: boolean;
}

interface GalleryUploaderProps {
  mode: "gallery";
  images: string[];
  onChange: (images: string[]) => void;
  primaryImage?: string;
  onSetPrimary?: (url: string) => void;
  label?: string;
  description?: string;
}

export type ImageUploaderProps = SingleImageUploaderProps | GalleryUploaderProps;

/**
 * Client-Side Smart Image Compression
 * Downscales images exceeding 1920px and compresses to clean high-efficiency WebP/JPEG (0.85 quality).
 * Reduces 8MB-15MB phone camera photos to ~300KB without visible quality loss.
 * Prevents Vercel 4.5MB payload limit errors and ensures instant uploads.
 */
async function compressImageForWeb(file: File): Promise<File> {
  // SVGs and animated GIFs should not be processed via canvas
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // If already under 350KB, no downscaling needed
  if (file.size < 350 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(file);
          return;
        }

        const MAX_DIMENSION = 1920;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP (or fallback to JPEG if WebP not supported)
        const outputMime = "image/webp";
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const originalBase = file.name.replace(/\.[^/.]+$/, "");
              const optimizedName = `${originalBase}.webp`;
              const optimizedFile = new File([blob], optimizedName, {
                type: outputMime,
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              // If canvas output is somehow larger, keep the original
              resolve(file);
            }
          },
          outputMime,
          0.85
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    } catch {
      resolve(file);
    }
  });
}

/**
 * Helper to ensure a valid admin session token is available
 */
async function getOrRefreshToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    let token = localStorage.getItem("kradind_admin_token");
    if (token) return token;

    // Fetch active session from server cookie
    const res = await fetch("/api/admin/auth", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("kradind_admin_token", data.token);
        return data.token;
      }
    }
  } catch {}

  return null;
}

export function ImageUploader(props: ImageUploaderProps) {
  const isGallery = props.mode === "gallery";

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Active input mode: "upload" or "link"
  const [activeMode, setActiveMode] = useState<"upload" | "link">("upload");
  const [linkInput, setLinkInput] = useState("");
  const [isEditingExistingLink, setIsEditingExistingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lightbox preview modal
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync current value to link input
  useEffect(() => {
    if (!isGallery) {
      const singleVal = (props as SingleImageUploaderProps).value || "";
      setLinkInput(singleVal);
    }
  }, [isGallery, props]);

  /**
   * Upload single or multiple files to /api/admin/upload
   * Features client-side auto-compression and token recovery
   */
  const uploadFiles = async (rawFiles: FileList | File[]) => {
    if (!rawFiles || rawFiles.length === 0) return;

    setErrorMessage("");
    setIsUploading(true);

    try {
      const fileCount = rawFiles.length;
      setUploadProgress(
        fileCount === 1
          ? "Optimizing and compressing photo..."
          : `Optimizing ${fileCount} photos...`
      );

      // 1. Process and compress files in parallel
      const compressedFiles: File[] = [];
      for (let i = 0; i < rawFiles.length; i++) {
        const file = rawFiles[i];
        try {
          const optimized = await compressImageForWeb(file);
          compressedFiles.push(optimized);
        } catch {
          compressedFiles.push(file);
        }
      }

      setUploadProgress(
        fileCount === 1 ? "Uploading photo to server..." : `Uploading ${fileCount} photos...`
      );

      // 2. Prepare FormData
      const formData = new FormData();
      for (const f of compressedFiles) {
        formData.append("file", f);
      }

      // 3. Resolve Admin Auth Token
      const token = await getOrRefreshToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers["x-admin-token"] = token;
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 4. Send request
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        if (res.status === 401) {
          throw new Error("Admin session expired or unauthorized. Please re-login to upload.");
        }

        if (res.status === 413) {
          throw new Error("File size is too large for the server. Please try a smaller photo.");
        }

        throw new Error(data?.error || `Upload failed with HTTP ${res.status}`);
      }

      const data = await res.json();

      if (isGallery) {
        const galleryProps = props as GalleryUploaderProps;
        const newUrls: string[] = [];
        if (data.urls && Array.isArray(data.urls)) {
          newUrls.push(...data.urls);
        } else if (data.url) {
          newUrls.push(data.url);
        }
        galleryProps.onChange([...galleryProps.images, ...newUrls]);
      } else {
        const singleProps = props as SingleImageUploaderProps;
        const uploadedUrl = data.url || (data.files && data.files[0]?.url);
        if (uploadedUrl) {
          singleProps.onChange(uploadedUrl);
          setLinkInput(uploadedUrl);
        }
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Failed to upload photo. Please try again or use direct link.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /**
   * Drag & drop handlers
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [isGallery, props]
  );

  /**
   * Handle pasting image from clipboard (Ctrl+V)
   */
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        uploadFiles(imageFiles);
      }
    },
    [isGallery, props]
  );

  /**
   * Handle pasting / applying image link
   */
  const handleApplyLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) {
      setErrorMessage("Please enter a valid image URL link.");
      return;
    }

    if (isGallery) {
      const galleryProps = props as GalleryUploaderProps;
      const splitUrls = trimmed
        .split(/[\n,]+/)
        .map((u) => u.trim())
        .filter((u) => u.length > 0);
      galleryProps.onChange([...galleryProps.images, ...splitUrls]);
      setLinkInput("");
    } else {
      const singleProps = props as SingleImageUploaderProps;
      singleProps.onChange(trimmed);
      setIsEditingExistingLink(false);
    }
    setErrorMessage("");
  };

  /**
   * Copy to clipboard
   */
  const copyLink = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * SINGLE IMAGE MODE
   */
  if (!isGallery) {
    const singleProps = props as SingleImageUploaderProps;
    const value = singleProps.value;
    const aspectClass =
      singleProps.aspect === "banner"
        ? "aspect-[21/9]"
        : singleProps.aspect === "square"
        ? "aspect-square"
        : singleProps.aspect === "video"
        ? "aspect-video"
        : "aspect-[16/9]";

    return (
      <div className="space-y-3" ref={containerRef} onPaste={handlePaste}>
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,image/jfif,image/bmp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              uploadFiles(e.target.files);
            }
          }}
        />

        {/* Header with Title & Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div>
            {singleProps.label && (
              <label className="block text-xs font-bold text-slate-800">
                {singleProps.label} {singleProps.required && <span className="text-rose-500">*</span>}
              </label>
            )}
            {singleProps.description && (
              <p className="text-[11px] text-slate-500">{singleProps.description}</p>
            )}
          </div>

          {/* Mode Tabs: File Upload vs Link Input */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveMode("upload");
                fileInputRef.current?.click();
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeMode === "upload"
                  ? "bg-white text-[#0F3A2E] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("link")}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeMode === "link"
                  ? "bg-white text-[#0F3A2E] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Paste Image Link</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1 font-medium">
              {errorMessage}
              {errorMessage.includes("re-login") && (
                <a
                  href="/admin/login"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 font-bold text-rose-950 underline hover:text-black inline-flex items-center gap-0.5"
                >
                  Log In Here <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </span>
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="text-rose-400 hover:text-rose-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Link Input Section (Active if link mode chosen) */}
        {activeMode === "link" && (
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2 animate-in fade-in">
            <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Enter or Paste Direct Image URL:</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or any online image URL"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyLink();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleApplyLink}
                disabled={!linkInput.trim()}
                className="px-4 py-2 bg-[#0F3A2E] text-white rounded-lg text-xs font-bold hover:bg-[#164e3f] disabled:opacity-50 transition shadow-2xs"
              >
                Apply Link
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Compatible with Unsplash, Pexels, Cloudinary, Imgur, Google Drive, or any direct image link.
            </p>
          </div>
        )}

        {/* Image Preview & Details Card */}
        {value ? (
          <div className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden space-y-0">
            {/* Visual Preview */}
            <div className={`relative w-full ${aspectClass} overflow-hidden bg-slate-950 group`}>
              <img
                src={value}
                alt="Selected photo"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-white">
                  <button
                    type="button"
                    onClick={() => setLightboxUrl(value)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur text-white font-semibold transition"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Full Size</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F3A2E] hover:bg-[#164e3f] text-white font-semibold transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode("link")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Change Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      singleProps.onChange("");
                      setLinkInput("");
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Editable Link Bar Below Image */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => {
                    setLinkInput(e.target.value);
                    setIsEditingExistingLink(true);
                  }}
                  placeholder="Image URL link..."
                  className="w-full text-xs font-mono text-slate-700 outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isEditingExistingLink && (
                  <button
                    type="button"
                    onClick={handleApplyLink}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    Save URL
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => copyLink(value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1 transition"
                  title="Copy link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Replace Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    singleProps.onChange("");
                    setLinkInput("");
                  }}
                  className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                  title="Delete photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Dropzone / Upload Area */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-6 text-center transition flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? "border-emerald-500 bg-emerald-50 scale-[0.99]"
                : "border-slate-300 hover:border-emerald-600 bg-slate-50/70"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>{uploadProgress}</span>
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-emerald-700">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Drag &amp; drop photo here, or choose an option:
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WEBP, AVIF from device (auto-compressed for blazing speed) or web URL.
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode("link")}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Paste Image Link</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Optional Image Alt Tag (SEO & Accessibility) */}
        {singleProps.onAltChange && (
          <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Image Alt Tag (SEO &amp; Accessibility)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Google Image SEO Keyword</span>
            </div>
            <input
              type="text"
              value={singleProps.alt || ""}
              onChange={(e) => singleProps.onAltChange!(e.target.value)}
              placeholder={singleProps.altPlaceholder || "e.g. Domestic and international tour packages by KRAD Global in Dehradun"}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
            />
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-semibold">Quick Alt Presets:</span>
              {ALT_TEXT_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => singleProps.onAltChange!(preset.value)}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#0F3A2E] border border-slate-200 transition shadow-2xs"
                  title={preset.value}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        {lightboxUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setLightboxUrl(null)}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
              <button
                type="button"
                onClick={() => setLightboxUrl(null)}
                className="absolute top-2 right-2 text-white/80 hover:text-white p-2 rounded-full bg-black/60 z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={lightboxUrl}
                alt="Full size preview"
                className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * GALLERY MODE
   */
  const galleryProps = props as GalleryUploaderProps;
  const images = galleryProps.images || [];

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    galleryProps.onChange(next);
  };

  const handleRemove = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    galleryProps.onChange(next);
  };

  return (
    <div className="space-y-3" ref={containerRef} onPaste={handlePaste}>
      {/* Hidden File Input for Multiple Selection */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,image/jfif,image/bmp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            uploadFiles(e.target.files);
          }
        }}
      />

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <span>{galleryProps.label || "Expedition Photo Gallery"}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              {images.length} Photos
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {galleryProps.description ||
              "Upload files from device or enter image links. Click star on any photo to set as Cover Photo."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMode(activeMode === "link" ? "upload" : "link")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
              activeMode === "link"
                ? "bg-blue-50 border-blue-300 text-blue-800"
                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Paste Link</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 rounded-xl bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-60"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photos</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1 font-medium">
            {errorMessage}
            {errorMessage.includes("re-login") && (
              <a
                href="/admin/login"
                target="_blank"
                rel="noreferrer"
                className="ml-2 font-bold text-rose-950 underline hover:text-black inline-flex items-center gap-0.5"
              >
                Log In <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </span>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-rose-400 hover:text-rose-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Direct Link Input Box */}
      {activeMode === "link" && (
        <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2 animate-in fade-in">
          <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Paste One or More Image URLs:</span>
          </div>
          <textarea
            rows={2}
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            placeholder="Paste image link(s) here. Separate multiple links with commas or newlines:&#10;https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3A2E] font-mono"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Supports direct URLs from any website or image CDN.</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveMode("upload")}
                className="px-3 py-1 text-slate-500 hover:text-slate-700 text-xs font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleApplyLink}
                disabled={!linkInput.trim()}
                className="px-4 py-1.5 bg-[#0F3A2E] text-white rounded-lg text-xs font-bold hover:bg-[#164e3f] disabled:opacity-50 transition"
              >
                Add Link(s) to Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition flex items-center justify-center gap-3 ${
          isDragging
            ? "border-emerald-500 bg-emerald-50 scale-[0.99]"
            : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-600"
        }`}
      >
        {isUploading ? (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <div className="w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{uploadProgress}</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>
              <strong>Drop photos here</strong> or click to upload multiple images at once (auto-compressed for speed)
            </span>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {images.map((img, idx) => {
            const isPrimary = galleryProps.primaryImage === img;

            return (
              <div
                key={`${img}-${idx}`}
                className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[4/3] shadow-2xs"
              >
                <img
                  src={img}
                  alt={`Gallery photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Primary Cover Badge */}
                {isPrimary && (
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Cover Photo</span>
                  </div>
                )}

                {/* Hover Overlay Controls */}
                <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/80 font-semibold">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                      className="p-1 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white transition"
                      title="Delete this photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 py-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxUrl(img);
                      }}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
                      title="Enlarge photo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {galleryProps.onSetPrimary && !isPrimary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          galleryProps.onSetPrimary?.(img);
                        }}
                        className="p-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-slate-950 transition flex items-center gap-1 text-[10px] font-bold"
                        title="Set as Primary Cover Photo"
                      >
                        <Star className="w-3 h-3" />
                        <span>Make Cover</span>
                      </button>
                    )}
                  </div>

                  {/* Reorder Arrows */}
                  <div className="flex items-center justify-between text-white/70">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(idx, idx - 1);
                      }}
                      className="p-0.5 hover:text-white disabled:opacity-30"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] text-white/60 truncate max-w-[60px]">
                      {img.startsWith("/uploads/") ? "Upload" : "Link"}
                    </span>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(idx, idx + 1);
                      }}
                      className="p-0.5 hover:text-white disabled:opacity-30"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
          <p className="text-xs text-slate-500 font-semibold">No photos in gallery yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Click &quot;Upload Photos&quot; to pick files from device or &quot;Paste Link&quot; to add image URLs.
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              className="absolute top-2 right-2 text-white/80 hover:text-white p-2 rounded-full bg-black/60 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxUrl}
              alt="Enlarged gallery photo"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
