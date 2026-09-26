export enum SurfaceKind {
    Key = "key",
    Dial = "dial",
}

export type Size = {
    readonly width: number;
    readonly height: number;
};

export type Surface = Size & {
    readonly kind: SurfaceKind;
};

export const KEY_SURFACE: Surface = { kind: SurfaceKind.Key, width: 144, height: 144 };

export const DIAL_SURFACE: Surface = { kind: SurfaceKind.Dial, width: 200, height: 100 };
