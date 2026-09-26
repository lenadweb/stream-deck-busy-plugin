import { SurfaceKind } from "./surface";

export type Point = {
    readonly cx: number;
    readonly cy: number;
};

export type Bounds = {
    readonly maxWidth: number;
    readonly maxHeight: number;
};

export type FontRange = {
    readonly maxFont: number;
    readonly minFont: number;
};

export type IconSlot = Point & {
    readonly size: number;
};

export type TextSlot = Point & Bounds & FontRange;

export type Slots = {
    readonly icon?: IconSlot;
    readonly text?: TextSlot;
};

export type Content = {
    readonly hasIcon: boolean;
    readonly hasText: boolean;
};

enum Composition {
    IconAndText = "iconAndText",
    IconOnly = "iconOnly",
    TextOnly = "textOnly",
    Empty = "empty",
}

type SurfaceLayout = Readonly<Record<Composition, Slots>>;

const layouts: Readonly<Record<SurfaceKind, SurfaceLayout>> = {
    [SurfaceKind.Key]: {
        [Composition.IconAndText]: {
            icon: { cx: 72, cy: 54, size: 60 },
            text: { cx: 72, cy: 112, maxWidth: 128, maxHeight: 44, maxFont: 30, minFont: 10 },
        },
        [Composition.IconOnly]: {
            icon: { cx: 72, cy: 72, size: 88 },
        },
        [Composition.TextOnly]: {
            text: { cx: 72, cy: 72, maxWidth: 128, maxHeight: 120, maxFont: 40, minFont: 10 },
        },
        [Composition.Empty]: {},
    },
    [SurfaceKind.Dial]: {
        [Composition.IconAndText]: {
            icon: { cx: 52, cy: 50, size: 60 },
            text: { cx: 139, cy: 50, maxWidth: 104, maxHeight: 84, maxFont: 34, minFont: 11 },
        },
        [Composition.IconOnly]: {
            icon: { cx: 100, cy: 50, size: 72 },
        },
        [Composition.TextOnly]: {
            text: { cx: 100, cy: 50, maxWidth: 176, maxHeight: 84, maxFont: 42, minFont: 12 },
        },
        [Composition.Empty]: {},
    },
};

export function layoutFor(surface: SurfaceKind, content: Content): Slots {
    return layouts[surface][compositionOf(content)];
}

function compositionOf({ hasIcon, hasText }: Content): Composition {
    if (hasIcon && hasText) {
        return Composition.IconAndText;
    }
    if (hasIcon) {
        return Composition.IconOnly;
    }
    return hasText ? Composition.TextOnly : Composition.Empty;
}
