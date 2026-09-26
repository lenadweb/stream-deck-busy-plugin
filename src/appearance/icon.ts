export enum IconName {
    Check = "check",
    NoEntry = "no-entry",
    Coffee = "coffee",
    Smile = "smile",
    DoorOpen = "door-open",
    Headphones = "headphones",
    Microphone = "mic",
    Video = "video",
    Phone = "phone",
    Moon = "moon",
    Lock = "lock",
    BellOff = "bell-off",
}

export const NO_ICON = "none";

export type IconChoice = IconName | typeof NO_ICON;

const ICON_NAMES: readonly string[] = Object.values(IconName);

export function isIconName(value: unknown): value is IconName {
    return typeof value === "string" && ICON_NAMES.includes(value);
}
