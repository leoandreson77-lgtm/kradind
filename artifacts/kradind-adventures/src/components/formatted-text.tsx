"use client";

import React from "react";

interface FormattedTextProps {
  text?: string | null;
  className?: string;
}

/**
 * Safely parses and renders formatted text with:
 * - Bold: `**text**`, `<b>text</b>`, `<strong>text</strong>`
 * - Italic: `*text*`, `<i>text</i>`, `<em>text</em>`
 * - Custom Sizing:
 *    `[size=xs]...[/size]` -> 11px
 *    `[size=sm]...[/size]` -> 12px
 *    `[size=base]...[/size]` -> 14-16px
 *    `[size=lg]...[/size]` -> 18px (semi-bold)
 *    `[size=xl]...[/size]` -> 22px (bold)
 *    `[size=2xl]...[/size]` -> 26px (extra-bold)
 * - Highlights & Colors:
 *    `[color=orange]...[/color]` -> #FF6B35
 *    `[color=emerald]...[/color]` -> Emerald green
 *    `[highlight]...[/highlight]` -> Yellow marker
 * - Headings:
 *    `## Heading 2`
 *    `### Heading 3`
 */
export function FormattedText({ text, className = "" }: FormattedTextProps) {
  if (!text || typeof text !== "string") return null;

  // Split into paragraphs by double newlines
  const paragraphs = text.split(/\n{2,}/);

  return (
    <div className={`space-y-2.5 ${className}`}>
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Heading 2
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={pIdx} className="text-lg sm:text-xl font-black text-slate-900 mt-3 mb-1 brand-font">
              {parseInlineFormatting(trimmed.slice(3))}
            </h3>
          );
        }

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={pIdx} className="text-base sm:text-lg font-bold text-slate-900 mt-2 mb-1 brand-font">
              {parseInlineFormatting(trimmed.slice(4))}
            </h4>
          );
        }

        // Split single line breaks within a paragraph
        const lines = para.split(/\n/);

        return (
          <div key={pIdx} className="space-y-1.5 leading-relaxed">
            {lines.map((line, lIdx) => {
              const trimmedLine = line.trim();
              if (
                trimmedLine.startsWith("• ") ||
                trimmedLine.startsWith("- ") ||
                trimmedLine.startsWith("* ")
              ) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2 my-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-2 shrink-0" />
                    <span className="flex-1">
                      {parseInlineFormatting(trimmedLine.slice(2))}
                    </span>
                  </div>
                );
              }
              return (
                <React.Fragment key={lIdx}>
                  {parseInlineFormatting(line)}
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Parses inline formatting tags:
 * **bold**, *italic*, <u>underline</u>, <s>strikethrough</s>, [badge]badge[/badge], [size=...], [color=...], [highlight], <b>, <i>
 */
export function parseInlineFormatting(str: string): React.ReactNode[] {
  if (!str || typeof str !== "string") return [];

  // Tokenize regex matching:
  // 1. [size=...]...[/size]
  // 2. [color=...]...[/color]
  // 3. [highlight]...[/highlight]
  // 4. [badge]...[/badge]
  // 5. <u>...</u> or [u]...[/u]
  // 6. <s>...</s> or [strike]...[/strike] or ~~...~~
  // 7. **...** or <b>...</b> or <strong>...</strong>
  // 8. *...* or <i>...</i> or <em>...</em>
  const pattern =
    /(\[size=(xs|sm|base|lg|xl|2xl)\]([\s\S]*?)\[\/size\]|\[color=(orange|emerald|blue|rose)\]([\s\S]*?)\[\/color\]|\[highlight\]([\s\S]*?)\[\/highlight\]|\[badge\]([\s\S]*?)\[\/badge\]|<u>([\s\S]+?)<\/u>|\[u\]([\s\S]+?)\[\/u\]|<s>([\s\S]+?)<\/s>|\[strike\]([\s\S]+?)\[\/strike\]|~~([\s\S]+?)~~|\*\*([\s\S]+?)\*\*|<b>([\s\S]+?)<\/b>|<strong>([\s\S]+?)<\/strong>|\*([\s\S]+?)\*|<i>([\s\S]+?)<\/i>|<em>([\s\S]+?)<\/em>)/g;

  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(str)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      result.push(str.slice(lastIndex, match.index));
    }

    const fullMatch = match[0];
    const sizeType = match[2];
    const sizeContent = match[3];
    const colorType = match[4];
    const colorContent = match[5];
    const highlightContent = match[6];
    const badgeContent = match[7];
    const underlineContent = match[8] || match[9];
    const strikeContent = match[10] || match[11] || match[12];
    const boldContent = match[13] || match[14] || match[15];
    const italicContent = match[16] || match[17] || match[18];

    const key = `${match.index}-${lastIndex}`;

    if (sizeType && sizeContent !== undefined) {
      const sizeClasses: Record<string, string> = {
        xs: "text-[11px] leading-tight",
        sm: "text-xs leading-normal",
        base: "text-sm sm:text-base leading-relaxed",
        lg: "text-base sm:text-lg font-bold leading-snug",
        xl: "text-lg sm:text-xl font-extrabold leading-snug text-slate-900",
        "2xl": "text-xl sm:text-2xl font-black leading-tight text-slate-900",
      };
      result.push(
        <span key={key} className={sizeClasses[sizeType] || "text-base"}>
          {parseInlineFormatting(sizeContent)}
        </span>
      );
    } else if (colorType && colorContent !== undefined) {
      const colorClasses: Record<string, string> = {
        orange: "text-[#FF6B35] font-bold",
        emerald: "text-emerald-700 font-bold",
        blue: "text-sky-600 font-bold",
        rose: "text-rose-600 font-bold",
      };
      result.push(
        <span key={key} className={colorClasses[colorType] || "text-[#FF6B35]"}>
          {parseInlineFormatting(colorContent)}
        </span>
      );
    } else if (highlightContent !== undefined) {
      result.push(
        <mark key={key} className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-medium">
          {parseInlineFormatting(highlightContent)}
        </mark>
      );
    } else if (badgeContent !== undefined) {
      result.push(
        <span
          key={key}
          className="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60 align-baseline"
        >
          {parseInlineFormatting(badgeContent)}
        </span>
      );
    } else if (underlineContent !== undefined) {
      result.push(
        <span key={key} className="underline decoration-[#FF6B35]/70 underline-offset-2 font-medium">
          {parseInlineFormatting(underlineContent)}
        </span>
      );
    } else if (strikeContent !== undefined) {
      result.push(
        <span key={key} className="line-through text-slate-400">
          {parseInlineFormatting(strikeContent)}
        </span>
      );
    } else if (boldContent !== undefined) {
      result.push(
        <strong key={key} className="font-extrabold text-slate-900">
          {parseInlineFormatting(boldContent)}
        </strong>
      );
    } else if (italicContent !== undefined) {
      result.push(
        <em key={key} className="italic font-medium text-slate-800">
          {parseInlineFormatting(italicContent)}
        </em>
      );
    } else {
      result.push(fullMatch);
    }

    lastIndex = pattern.lastIndex;
  }

  // Push trailing text
  if (lastIndex < str.length) {
    result.push(str.slice(lastIndex));
  }

  return result.length > 0 ? result : [str];
}
