export type AttributeValue = string | number;

export type Attributes = Readonly<Record<string, AttributeValue>>;

export type SvgMarkup = string;

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export function element(tag: string, attributes: Attributes = {}, children: SvgMarkup = ""): SvgMarkup {
    const serialized = Object.entries(attributes)
        .map(([name, value]) => ` ${name}="${serializeValue(value)}"`)
        .join("");
    return children ? `<${tag}${serialized}>${children}</${tag}>` : `<${tag}${serialized} />`;
}

export function svgDocument(width: number, height: number, children: SvgMarkup): SvgMarkup {
    return element("svg", { xmlns: SVG_NAMESPACE, width, height, viewBox: `0 0 ${width} ${height}` }, children);
}

export function escapeXml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function formatNumber(value: number): string {
    return String(Math.round(value * 100) / 100);
}

export function toDataUrl(svg: SvgMarkup): string {
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function serializeValue(value: AttributeValue): string {
    return typeof value === "number" ? formatNumber(value) : escapeXml(value);
}
