import type { Slide } from '@typodeck/core';

const SERIF = '"Noto Serif KR", "Source Serif 4", Georgia, serif';
const SANS = 'Pretendard, Inter, "Noto Sans KR", system-ui, sans-serif';
const DISPLAY = '"Archivo Black", Pretendard, Inter, "Noto Sans KR", system-ui, sans-serif';

/** Preview-only font mapping that mirrors each system's export faces. */
function fontFor(system: string, role: string, fonts?: { heading: string; body: string }): string {
  if (fonts) {
    return role === 'body' || role === 'caption' ? fonts.body : fonts.heading;
  }
  if (system === 'editorial') {
    return role === 'body' || role === 'caption' ? SANS : SERIF;
  }
  if (system === 'expressive') {
    return role === 'body' || role === 'caption' ? SANS : DISPLAY;
  }
  return SANS;
}

const CANVAS_W_IN = 13.33;
const CANVAS_H_IN = 7.5;

/**
 * Text-only slide preview: absolutely-positioned text divs scaled from the
 * deck's inch geometry. No canvas rasterization, no decorative shapes.
 */
export function SlideView({
  slide,
  system,
  label,
  fonts,
}: {
  slide: Slide;
  system: string;
  label?: string;
  /** Registry-driven font stacks (from /api/catalog); falls back to the built-in map. */
  fonts?: { heading: string; body: string };
}) {
  return (
    <div className="slide" style={{ backgroundColor: slide.background }} role="img" aria-label={label ?? slide.thesis}>
      {slide.blocks.map((b) => (
        <div
          key={b.id}
          className="slide-block"
          style={{
            left: `${(b.x / CANVAS_W_IN) * 100}%`,
            top: `${(b.y / CANVAS_H_IN) * 100}%`,
            width: `${(b.w / CANVAS_W_IN) * 100}%`,
            height: `${(b.h / CANVAS_H_IN) * 100}%`,
            fontSize: `${((b.fontSize / 72) / CANVAS_W_IN) * 100}cqw`,
            fontWeight: b.fontWeight,
            lineHeight: b.lineHeight,
            letterSpacing: `${b.tracking}em`,
            textAlign: b.align,
            color: b.color,
            fontFamily: fontFor(system, b.role, fonts),
          }}
        >
          {b.content}
        </div>
      ))}
    </div>
  );
}
