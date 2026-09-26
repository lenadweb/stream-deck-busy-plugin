import { Status } from "../status/status";

export type HexColor = `#${string}`;

export type Palette = {
    readonly gradientStart: HexColor;
    readonly gradientEnd: HexColor;
    readonly ink: HexColor;
};

export type Sheen = {
    readonly color: HexColor;
    readonly opacity: number;
};

export type Typography = {
    readonly family: string;
    readonly weight: number;
    readonly lineHeight: number;
    readonly baselineShift: number;
};

export type Iconography = {
    readonly glyphStroke: number;
    readonly glyphGrid: number;
    readonly checkStrokeRatio: number;
    readonly checkFillOpacity: number;
    readonly noEntryBarWidthRatio: number;
    readonly noEntryBarHeightRatio: number;
};

export const palettes: Readonly<Record<Status, Palette>> = {
    [Status.Free]: { gradientStart: "#22c55e", gradientEnd: "#15803d", ink: "#15803d" },
    [Status.Busy]: { gradientStart: "#ef4444", gradientEnd: "#991b1b", ink: "#b91c1c" },
};

export const foreground: HexColor = "#ffffff";

export const sheen: Sheen = {
    color: "#ffffff",
    opacity: 0.28,
};

export const typography: Typography = {
    family: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    weight: 800,
    lineHeight: 1.1,
    baselineShift: 0.35,
};

export const iconography: Iconography = {
    glyphStroke: 2.2,
    glyphGrid: 24,
    checkStrokeRatio: 0.1,
    checkFillOpacity: 0.16,
    noEntryBarWidthRatio: 0.58,
    noEntryBarHeightRatio: 0.17,
};
