interface Palette {
    start: string;
    stop: string;
    ink: string;
}

const FREE: Palette = { start: "#22c55e", stop: "#15803d", ink: "#15803d" };
const BUSY: Palette = { start: "#ef4444", stop: "#991b1b", ink: "#b91c1c" };

const DEFAULT_FREE_TEXT = "FREE";
const DEFAULT_BUSY_TEXT = "BUSY";

const LINE_HEIGHT = 1.1;
const SINGLE_LINE_MIN_SCALE = 0.6;

interface TextBox {
    cx: number;
    cy: number;
    maxWidth: number;
    maxHeight: number;
    maxFont: number;
    minFont: number;
}

export class BusyRenderer {
    render(busy: boolean, text: string | undefined, width: number, height: number): string {
        const palette = busy ? BUSY : FREE;
        const label = text && text.trim() ? text.trim() : busy ? DEFAULT_BUSY_TEXT : DEFAULT_FREE_TEXT;
        const isDial = width > height;

        let body = this.background(palette, width, height);
        if (isDial) {
            body += this.icon(busy, palette, 52, 50, 60);
            body += this.text(label, { cx: 139, cy: 50, maxWidth: 104, maxHeight: 84, maxFont: 34, minFont: 11 });
        } else {
            body += this.icon(busy, palette, 72, 54, 60);
            body += this.text(label, { cx: 72, cy: 112, maxWidth: 128, maxHeight: 44, maxFont: 30, minFont: 10 });
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
    }

    private background(palette: Palette, width: number, height: number): string {
        return `<defs>`
            + `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${palette.start}" /><stop offset="100%" stop-color="${palette.stop}" /></linearGradient>`
            + `<radialGradient id="sheen" cx="30%" cy="0%" r="90%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.28" /><stop offset="100%" stop-color="#ffffff" stop-opacity="0" /></radialGradient>`
            + `</defs>`
            + `<rect width="${width}" height="${height}" fill="url(#bg)" />`
            + `<rect width="${width}" height="${height}" fill="url(#sheen)" />`;
    }

    private icon(busy: boolean, palette: Palette, cx: number, cy: number, size: number): string {
        const r = size / 2;
        if (busy) {
            const barW = size * 0.58;
            const barH = size * 0.17;
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" />`
                + `<rect x="${this.round(cx - barW / 2)}" y="${this.round(cy - barH / 2)}" width="${this.round(barW)}" height="${this.round(barH)}" rx="${this.round(barH / 2)}" fill="${palette.ink}" />`;
        }
        const stroke = this.round(size * 0.1);
        const ring = r - stroke / 2;
        const p = (dx: number, dy: number) => `${this.round(cx + dx * r)} ${this.round(cy + dy * r)}`;
        return `<circle cx="${cx}" cy="${cy}" r="${this.round(ring)}" fill="#ffffff" fill-opacity="0.16" stroke="#ffffff" stroke-width="${stroke}" />`
            + `<path d="M ${p(-0.42, 0.02)} L ${p(-0.12, 0.32)} L ${p(0.44, -0.26)}" fill="none" stroke="#ffffff" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" />`;
    }

    private text(value: string, box: TextBox): string {
        const fits = (lines: string[], size: number) =>
            lines.reduce((m, l) => Math.max(m, this.measure(l, size)), 0) <= box.maxWidth
            && lines.length * size * LINE_HEIGHT <= box.maxHeight;

        let fontSize = box.maxFont;
        let lines = [value];
        const singleLineMin = Math.max(box.minFont, Math.ceil(box.maxFont * SINGLE_LINE_MIN_SCALE));
        while (!fits(lines, fontSize) && fontSize > singleLineMin) {
            fontSize--;
        }
        if (!fits(lines, fontSize)) {
            fontSize = box.maxFont;
            while (true) {
                lines = this.wrap(value, box.maxWidth, fontSize);
                if (fits(lines, fontSize) || fontSize <= box.minFont) {
                    break;
                }
                fontSize--;
            }
        }

        const lineHeight = fontSize * LINE_HEIGHT;
        const top = box.cy - (lines.length * lineHeight) / 2;
        return lines.map((line, i) => {
            const y = top + lineHeight * (i + 0.5) + fontSize * 0.35;
            return `<text x="${box.cx}" y="${this.round(y)}" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="${fontSize}" font-weight="800" fill="#ffffff" text-anchor="middle">${this.escape(line)}</text>`;
        }).join("");
    }

    private wrap(value: string, maxWidth: number, fontSize: number): string[] {
        const words = value.split(/\s+/).filter(Boolean);
        const out: string[] = [];
        let cur = "";
        for (const w of words) {
            if (cur && this.measure(`${cur} ${w}`, fontSize) <= maxWidth) {
                cur += ` ${w}`;
            } else {
                if (cur) out.push(cur);
                cur = w;
            }
        }
        if (cur) out.push(cur);
        return out.length ? out : [""];
    }

    private measure(text: string, fontSize: number): number {
        let em = 0;
        for (const ch of text) {
            if (ch === " ") em += 0.28;
            else if ("iljI.,:;'!|".includes(ch)) em += 0.32;
            else if ("mwMWшщжмШЩЖМ".includes(ch)) em += 0.95;
            else if (ch !== ch.toLowerCase()) em += 0.74;
            else if (/[\u0400-\u04FF]/.test(ch)) em += 0.68;
            else em += 0.62;
        }
        return em * fontSize;
    }

    private escape(s: string): string {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    private round(n: number): number {
        return Math.round(n * 100) / 100;
    }
}
