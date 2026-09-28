"use client";

import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Type,
  Highlighter,
  Palette,
  Heading2,
  Heading3,
  List,
  Eye,
  Edit3,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { FormattedText } from "@/components/formatted-text";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  minHeight?: string;
  className?: string;
  helperText?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = "Type your text here. Select text to apply formatting (Bold, Italic, Custom Font Size, Color, Highlights)...",
  rows = 5,
  minHeight = "120px",
  className = "",
  helperText,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  /**
   * Helper to wrap selected text in the textarea with prefix and suffix tags,
   * maintaining focus and appropriate cursor selection.
   */
  const wrapSelection = (prefix: string, suffix: string, defaultText: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentVal = value || "";

    if (start !== end) {
      // User has selected a chunk of text
      const selected = currentVal.substring(start, end);
      const updated =
        currentVal.substring(0, start) +
        prefix +
        selected +
        suffix +
        currentVal.substring(end);

      onChange(updated);

      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 10);
    } else {
      // No text selected: insert default placeholder and highlight it
      const updated =
        currentVal.substring(0, start) +
        prefix +
        defaultText +
        suffix +
        currentVal.substring(end);

      onChange(updated);

      setTimeout(() => {
        el.focus();
        el.setSelectionRange(
          start + prefix.length,
          start + prefix.length + defaultText.length
        );
      }, 10);
    }
  };

  /**
   * Helper to prepend a line token (e.g. "## " or "• ") at the start of current line
   */
  const insertLinePrefix = (linePrefix: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const currentVal = value || "";

    // Find previous newline to prepend to beginning of current line
    const lastNewline = currentVal.lastIndexOf("\n", start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const updated =
      currentVal.substring(0, lineStart) +
      linePrefix +
      currentVal.substring(lineStart);

    onChange(updated);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + linePrefix.length, start + linePrefix.length);
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+B / Cmd+B for Bold
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      wrapSelection("**", "**", "Bold Text");
    }
    // Ctrl+I / Cmd+I for Italic
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      wrapSelection("*", "*", "Italic Text");
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label and Header Row */}
      <div className="flex items-center justify-between gap-2">
        {label && (
          <label className="block text-xs font-bold text-slate-800">
            {label}
          </label>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {/* Write / Preview Tab Switcher */}
          <div className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                activeTab === "write"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Edit3 className="w-3 h-3 text-[#FF6B35]" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                activeTab === "preview"
                  ? "bg-white text-[#0F3A2E] shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3 h-3 text-emerald-600" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Quick Guide Toggle */}
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition"
            title="Formatting Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#0F3A2E]/20 focus-within:border-[#0F3A2E] transition">
        {/* Formatting Toolbar */}
        <div className="bg-slate-50/90 border-b border-slate-200/80 p-1.5 flex flex-wrap items-center gap-1 text-slate-700">
          {/* Bold Button */}
          <button
            type="button"
            onClick={() => wrapSelection("**", "**", "Bold Text")}
            className="p-1.5 rounded-lg hover:bg-slate-200/80 hover:text-slate-900 transition text-xs font-black flex items-center gap-1"
            title="Bold (Ctrl+B) - **text**"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Italic Button */}
          <button
            type="button"
            onClick={() => wrapSelection("*", "*", "Italic Text")}
            className="p-1.5 rounded-lg hover:bg-slate-200/80 hover:text-slate-900 transition text-xs italic font-serif flex items-center gap-1"
            title="Italic (Ctrl+I) - *text*"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-300 mx-0.5" />

          {/* Custom Font Sizing Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSizeMenu(!showSizeMenu);
                setShowColorMenu(false);
              }}
              className="px-2 py-1 rounded-lg hover:bg-slate-200/80 transition text-xs font-semibold flex items-center gap-1 text-slate-700"
              title="Custom Text Size"
            >
              <Type className="w-3.5 h-3.5 text-[#0F3A2E]" />
              <span className="text-[11px]">Size</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSizeMenu && (
              <div
                className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowSizeMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=xs]", "[/size]", "11px Tiny Text");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-[11px] text-slate-600 block"
                >
                  Extra Small (11px)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=sm]", "[/size]", "12px Small Text");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs text-slate-700 block"
                >
                  Small (12px)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=base]", "[/size]", "Standard Text");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-sm font-medium text-slate-800 block"
                >
                  Normal (14-16px)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=lg]", "[/size]", "18px Large Text");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-base font-bold text-slate-900 block"
                >
                  Large (18px)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=xl]", "[/size]", "22px Title Text");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-lg font-extrabold text-slate-900 block"
                >
                  Heading (22px)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=2xl]", "[/size]", "26px Extra Large");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xl font-black text-slate-900 block"
                >
                  Extra Large (26px)
                </button>
              </div>
            )}
          </div>

          <span className="w-px h-4 bg-slate-300 mx-0.5" />

          {/* Yellow Marker Highlight */}
          <button
            type="button"
            onClick={() => wrapSelection("[highlight]", "[/highlight]", "Highlighted Text")}
            className="p-1.5 rounded-lg hover:bg-amber-100 hover:text-amber-900 transition text-xs font-semibold flex items-center gap-1"
            title="Yellow Marker Highlight - [highlight]text[/highlight]"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] hidden sm:inline">Highlight</span>
          </button>

          {/* Color Tag Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorMenu(!showColorMenu);
                setShowSizeMenu(false);
              }}
              className="px-2 py-1 rounded-lg hover:bg-slate-200/80 transition text-xs font-semibold flex items-center gap-1 text-slate-700"
              title="Text Color"
            >
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[11px] hidden sm:inline">Color</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showColorMenu && (
              <div
                className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowColorMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[color=orange]", "[/color]", "Orange Highlight Text");
                    setShowColorMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-orange-50 text-[#FF6B35] font-bold block"
                >
                  ● Brand Orange
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[color=emerald]", "[/color]", "Emerald Highlight Text");
                    setShowColorMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 font-bold block"
                >
                  ● Alpine Emerald
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[color=blue]", "[/color]", "Sky Blue Text");
                    setShowColorMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-sky-600 font-bold block"
                >
                  ● Sky Blue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[color=rose]", "[/color]", "Rose Alert Text");
                    setShowColorMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 font-bold block"
                >
                  ● Alert Rose
                </button>
              </div>
            )}
          </div>

          <span className="w-px h-4 bg-slate-300 mx-0.5" />

          {/* Heading 2 */}
          <button
            type="button"
            onClick={() => insertLinePrefix("## ")}
            className="p-1.5 rounded-lg hover:bg-slate-200/80 transition text-xs font-bold"
            title="Heading 2 - ## Heading"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          {/* Heading 3 */}
          <button
            type="button"
            onClick={() => insertLinePrefix("### ")}
            className="p-1.5 rounded-lg hover:bg-slate-200/80 transition text-xs font-bold"
            title="Heading 3 - ### Heading"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          {/* Bullet Point */}
          <button
            type="button"
            onClick={() => insertLinePrefix("• ")}
            className="p-1.5 rounded-lg hover:bg-slate-200/80 transition text-xs font-bold"
            title="Bullet point - • item"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Guide Overlay Banner */}
        {showGuide && (
          <div className="bg-emerald-50 border-b border-emerald-100 p-3 text-xs text-emerald-950 space-y-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-bold">
              <span>Text Formatting Quick Guide</span>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-emerald-700 hover:text-emerald-950"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div>
                <code className="bg-white/80 px-1 py-0.5 rounded text-[#0F3A2E] font-bold">
                  **Bold Text**
                </code>{" "}
                ➔ <strong>Bold</strong>
              </div>
              <div>
                <code className="bg-white/80 px-1 py-0.5 rounded text-[#0F3A2E] font-bold">
                  *Italic Text*
                </code>{" "}
                ➔ <em>Italic</em>
              </div>
              <div>
                <code className="bg-white/80 px-1 py-0.5 rounded text-[#0F3A2E] font-bold">
                  [size=lg]Text[/size]
                </code>{" "}
                ➔ <span className="font-bold text-sm">Large Text</span>
              </div>
              <div>
                <code className="bg-white/80 px-1 py-0.5 rounded text-[#0F3A2E] font-bold">
                  [size=2xl]Text[/size]
                </code>{" "}
                ➔ <span className="font-black text-base">Big 26px</span>
              </div>
              <div>
                <code className="bg-white/80 px-1 py-0.5 rounded text-[#0F3A2E] font-bold">
                  [color=orange]Text[/color]
                </code>{" "}
                ➔ <span className="text-[#FF6B35] font-bold">Orange</span>
              </div>
              <div>
                <code className="bg-white/80 px-1 py-0.5 rounded text-[#0F3A2E] font-bold">
                  [highlight]Text[/highlight]
                </code>{" "}
                ➔ <mark className="bg-amber-100 px-1 rounded">Marker</mark>
              </div>
            </div>
          </div>
        )}

        {/* Write or Preview Body */}
        {activeTab === "write" ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-3 text-xs sm:text-sm font-sans leading-relaxed focus:outline-none resize-y text-slate-800 placeholder:text-slate-400 min-h-[120px]"
          />
        ) : (
          <div
            className="p-4 bg-slate-50/50 min-h-[120px] text-xs sm:text-sm text-slate-800 overflow-y-auto leading-relaxed border-t border-slate-100"
          >
            {value && value.trim() ? (
              <FormattedText text={value} />
            ) : (
              <p className="text-slate-400 italic">
                Nothing to preview yet. Switch back to Write mode and type some text.
              </p>
            )}
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-400 leading-normal">{helperText}</p>
      )}
    </div>
  );
}
