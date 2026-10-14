"use client";

import React, { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Tag,
  Highlighter,
  Palette,
  Type,
  Eye,
  EyeOff,
  Sparkles,
  ChevronDown,
  Eraser,
  CaseSensitive,
} from "lucide-react";
import { FormattedText } from "@/components/formatted-text";

export interface CustomEditableFieldProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  inputClassName?: string;
  helperText?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  defaultCustomEditOpen?: boolean;
  compact?: boolean;
}

export function CustomEditableField({
  value = "",
  onChange,
  label,
  placeholder,
  multiline = false,
  rows = 3,
  className = "",
  inputClassName = "",
  helperText,
  type = "text",
  disabled = false,
  required = false,
  defaultCustomEditOpen = false,
  compact = false,
}: CustomEditableFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isOpen, setIsOpen] = useState(defaultCustomEditOpen);
  const [showPreview, setShowPreview] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);

  // Check if string contains custom formatting tags
  const hasFormatting = Boolean(
    value &&
      (/\*\*.*?\*\*|\*.*?\*|<u>.*?<\/u>|\[size=|\[color=|\[badge\]|\[highlight\]/i.test(
        value
      ))
  );

  const getElement = (): HTMLInputElement | HTMLTextAreaElement | null => {
    return multiline ? textareaRef.current : inputRef.current;
  };

  /**
   * Wraps selected text or inserts formatted placeholder
   */
  const wrapSelection = (prefix: string, suffix: string, defaultPlaceholder: string) => {
    const el = getElement();
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const currentVal = value || "";

    if (start !== end) {
      const selectedText = currentVal.substring(start, end);
      const updated =
        currentVal.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        currentVal.substring(end);
      onChange(updated);

      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 10);
    } else {
      const updated =
        currentVal.substring(0, start) +
        prefix +
        defaultPlaceholder +
        suffix +
        currentVal.substring(end);
      onChange(updated);

      setTimeout(() => {
        el.focus();
        el.setSelectionRange(
          start + prefix.length,
          start + prefix.length + defaultPlaceholder.length
        );
      }, 10);
    }
  };

  /**
   * Apply text transforms (Title Case, UPPERCASE, lowercase)
   */
  const applyTransform = (transformType: "title" | "upper" | "lower") => {
    const el = getElement();
    const currentVal = value || "";

    if (el && el.selectionStart !== null && el.selectionEnd !== null && el.selectionStart !== el.selectionEnd) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = currentVal.substring(start, end);
      let transformed = selected;

      if (transformType === "title") {
        transformed = selected.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      } else if (transformType === "upper") {
        transformed = selected.toUpperCase();
      } else if (transformType === "lower") {
        transformed = selected.toLowerCase();
      }

      const updated = currentVal.substring(0, start) + transformed + currentVal.substring(end);
      onChange(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start + transformed.length);
      }, 10);
    } else {
      let transformed = currentVal;
      if (transformType === "title") {
        transformed = currentVal.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      } else if (transformType === "upper") {
        transformed = currentVal.toUpperCase();
      } else if (transformType === "lower") {
        transformed = currentVal.toLowerCase();
      }
      onChange(transformed);
    }
  };

  /**
   * Strip formatting tags to revert to clean text
   */
  const handleClearFormatting = () => {
    let clean = (value || "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/<u>(.*?)<\/u>/gi, "$1")
      .replace(/\[size=[^\]]*\](.*?)\[\/size\]/gi, "$1")
      .replace(/\[color=[^\]]*\](.*?)\[\/color\]/gi, "$1")
      .replace(/\[badge\](.*?)\[\/badge\]/gi, "$1")
      .replace(/\[highlight\](.*?)\[\/highlight\]/gi, "$1");
    onChange(clean);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      wrapSelection("**", "**", "Bold");
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      wrapSelection("*", "*", "Italic");
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
      e.preventDefault();
      wrapSelection("<u>", "</u>", "Underlined");
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Field Header: Label + Custom Edit Toggle (only if label is provided OR if not compact OR if open) */}
      {(label || !compact || isOpen) && (
        <div className="flex items-center justify-between gap-2">
          {label ? (
            <label className="block text-xs font-bold text-slate-800">
              {label}
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {hasFormatting && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                <span>Styled</span>
              </span>
            )}

            {/* Toggle Custom Edit Bar */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition border cursor-pointer ${
                isOpen
                  ? "bg-[#0F3A2E] text-white border-[#0F3A2E] shadow-2xs"
                  : "bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border-slate-200 hover:border-emerald-300"
              }`}
              title="Toggle Custom Edit Options (Bold, Colors, Sizes, Underline, Preview)"
            >
              <Sparkles className={`w-3 h-3 ${isOpen ? "text-amber-300" : "text-emerald-600"}`} />
              <span>Custom Edit</span>
              <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      )}

      {/* Floating / Inline Custom Edit Action Toolbar */}
      {isOpen && (
        <div className="p-1.5 bg-gradient-to-r from-slate-50 via-emerald-50/40 to-slate-50 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-1 text-slate-700 shadow-2xs animate-in fade-in zoom-in-95 duration-150">
          {/* Bold */}
          <button
            type="button"
            onClick={() => wrapSelection("**", "**", "Bold")}
            className="p-1 px-1.5 rounded-md hover:bg-white hover:text-slate-900 transition text-xs font-black flex items-center gap-0.5 border border-transparent hover:border-slate-200 hover:shadow-2xs"
            title="Bold (Ctrl+B) - **text**"
          >
            <Bold className="w-3 h-3" />
            <span className="text-[10px] font-bold">B</span>
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => wrapSelection("*", "*", "Italic")}
            className="p-1 px-1.5 rounded-md hover:bg-white hover:text-slate-900 transition text-xs italic font-serif flex items-center gap-0.5 border border-transparent hover:border-slate-200 hover:shadow-2xs"
            title="Italic (Ctrl+I) - *text*"
          >
            <Italic className="w-3 h-3" />
            <span className="text-[10px] italic">I</span>
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => wrapSelection("<u>", "</u>", "Underlined")}
            className="p-1 px-1.5 rounded-md hover:bg-white hover:text-slate-900 transition text-xs flex items-center gap-0.5 border border-transparent hover:border-slate-200 hover:shadow-2xs"
            title="Underline (Ctrl+U) - <u>text</u>"
          >
            <UnderlineIcon className="w-3 h-3" />
            <span className="text-[10px] underline">U</span>
          </button>

          <span className="w-px h-3.5 bg-slate-300 mx-0.5" />

          {/* Tag Badge */}
          <button
            type="button"
            onClick={() => wrapSelection("[badge]", "[/badge]", "Special")}
            className="p-1 px-1.5 rounded-md hover:bg-emerald-100 hover:text-emerald-950 transition text-[11px] font-bold text-emerald-800 flex items-center gap-1 border border-emerald-200/60 bg-emerald-50/70"
            title="Add Badge Pill - [badge]text[/badge]"
          >
            <Tag className="w-3 h-3 text-emerald-700" />
            <span>Badge</span>
          </button>

          {/* Highlight Marker */}
          <button
            type="button"
            onClick={() => wrapSelection("[highlight]", "[/highlight]", "Important")}
            className="p-1 px-1.5 rounded-md hover:bg-amber-100 hover:text-amber-950 transition text-[11px] font-bold text-amber-800 flex items-center gap-1 border border-amber-200/60 bg-amber-50/70"
            title="Yellow Highlight Marker - [highlight]text[/highlight]"
          >
            <Highlighter className="w-3 h-3 text-amber-600" />
            <span>Highlight</span>
          </button>

          {/* Color Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorMenu(!showColorMenu);
                setShowSizeMenu(false);
                setShowCaseMenu(false);
              }}
              className="p-1 px-1.5 rounded-md hover:bg-white transition text-[11px] font-bold text-slate-700 flex items-center gap-1 border border-slate-200/80"
              title="Custom Text Colors"
            >
              <Palette className="w-3 h-3 text-emerald-600" />
              <span>Color</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {showColorMenu && (
              <div
                className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowColorMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[color=emerald]", "[/color]", "Forest Green");
                    setShowColorMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Emerald</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[color=orange]", "[/color]", "Orange Highlight");
                    setShowColorMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-orange-50 text-[#FF6B35] font-bold flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                  <span>KRADIND Orange</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[color=blue]", "[/color]", "Blue Accent");
                    setShowColorMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-sky-50 text-sky-600 font-bold flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>Sky Blue</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[color=rose]", "[/color]", "Rose Accent");
                    setShowColorMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Rose Red</span>
                </button>
              </div>
            )}
          </div>

          {/* Size Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSizeMenu(!showSizeMenu);
                setShowColorMenu(false);
                setShowCaseMenu(false);
              }}
              className="p-1 px-1.5 rounded-md hover:bg-white transition text-[11px] font-bold text-slate-700 flex items-center gap-1 border border-slate-200/80"
              title="Custom Text Sizing"
            >
              <Type className="w-3 h-3 text-[#0F3A2E]" />
              <span>Size</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {showSizeMenu && (
              <div
                className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowSizeMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=sm]", "[/size]", "Small Text");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs text-slate-600"
                >
                  Small (12px)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=base]", "[/size]", "Normal Text");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-sm font-medium text-slate-800"
                >
                  Standard (14px)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=lg]", "[/size]", "Large Title");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-base font-bold text-slate-900"
                >
                  Large (18px)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    wrapSelection("[size=xl]", "[/size]", "Big Headline");
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-lg font-black text-slate-900"
                >
                  Headline (22px)
                </button>
              </div>
            )}
          </div>

          {/* Text Case Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowCaseMenu(!showCaseMenu);
                setShowColorMenu(false);
                setShowSizeMenu(false);
              }}
              className="p-1 px-1.5 rounded-md hover:bg-white transition text-[11px] font-bold text-slate-700 flex items-center gap-1 border border-slate-200/80"
              title="Transform Text Case"
            >
              <CaseSensitive className="w-3 h-3 text-slate-600" />
              <span>Case</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {showCaseMenu && (
              <div
                className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowCaseMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    applyTransform("title");
                    setShowCaseMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs font-semibold capitalize"
                >
                  Title Case
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyTransform("upper");
                    setShowCaseMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs font-black uppercase"
                >
                  UPPERCASE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyTransform("lower");
                    setShowCaseMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs font-normal lowercase"
                >
                  lowercase
                </button>
              </div>
            )}
          </div>

          <span className="w-px h-3.5 bg-slate-300 mx-0.5" />

          {/* Live Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`p-1 px-2 rounded-md transition text-[11px] font-bold flex items-center gap-1 border ${
              showPreview
                ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
            title="Toggle Live Rendered Preview"
          >
            {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-emerald-600" />}
            <span>Preview</span>
          </button>

          {/* Clear Format */}
          {hasFormatting && (
            <button
              type="button"
              onClick={handleClearFormatting}
              className="p-1 px-1.5 rounded-md hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition text-[11px] font-bold flex items-center gap-1 ml-auto border border-rose-200"
              title="Strip all formatting tags"
            >
              <Eraser className="w-3 h-3" />
              <span>Clean</span>
            </button>
          )}
        </div>
      )}

      {/* Input or Textarea Field */}
      <div className="relative">
        {multiline ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#0F3A2E]/20 focus:border-[#0F3A2E] outline-none transition disabled:bg-slate-100 disabled:opacity-60 leading-relaxed ${
              compact && !label && !isOpen ? "pr-16" : ""
            } ${inputClassName}`}
          />
        ) : (
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#0F3A2E]/20 focus:border-[#0F3A2E] outline-none transition disabled:bg-slate-100 disabled:opacity-60 ${
              compact && !label && !isOpen ? "pr-16" : ""
            } ${inputClassName}`}
          />
        )}

        {/* Compact Mode Inline Custom Edit Trigger */}
        {compact && !label && !isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-300 transition"
            title="Custom Edit formatting"
          >
            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Live Formatted Output Preview (when showPreview is toggled OR when formatting exists and preview active) */}
      {showPreview && (
        <div className="p-3 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 border border-emerald-200/80 rounded-xl space-y-1 shadow-2xs animate-in fade-in duration-150">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
            👁️ Live Rendered Preview on Website:
          </span>
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed min-h-[20px]">
            {value ? (
              <FormattedText text={value} />
            ) : (
              <span className="text-slate-400 italic text-xs">Preview will appear here when you type...</span>
            )}
          </div>
        </div>
      )}

      {/* Helper text if provided */}
      {helperText && (
        <p className="text-[11px] text-slate-400 leading-normal">{helperText}</p>
      )}
    </div>
  );
}
