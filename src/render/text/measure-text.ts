enum GlyphWidth {
    Space = 0.28,
    Narrow = 0.32,
    Wide = 0.95,
    Uppercase = 0.74,
    Cyrillic = 0.68,
    Regular = 0.62,
}

const NARROW_GLYPHS = new Set("iljI.,:;'!|");
const WIDE_GLYPHS = new Set("mwMWшщжмШЩЖМ");
const CYRILLIC = /[Ѐ-ӿ]/;

export function measureText(text: string, fontSize: number): number {
    return [...text].reduce((width, glyph) => width + glyphWidth(glyph), 0) * fontSize;
}

function glyphWidth(glyph: string): GlyphWidth {
    if (glyph === " ") {
        return GlyphWidth.Space;
    }
    if (NARROW_GLYPHS.has(glyph)) {
        return GlyphWidth.Narrow;
    }
    if (WIDE_GLYPHS.has(glyph)) {
        return GlyphWidth.Wide;
    }
    if (glyph !== glyph.toLowerCase()) {
        return GlyphWidth.Uppercase;
    }
    return CYRILLIC.test(glyph) ? GlyphWidth.Cyrillic : GlyphWidth.Regular;
}
