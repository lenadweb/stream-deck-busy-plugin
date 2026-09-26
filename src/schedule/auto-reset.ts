import { AutoResetSettings } from "../settings/busy-settings";
import { Duration, Milliseconds } from "./time";

export type AutoResetPolicy = {
    readonly delay: Milliseconds | null;
    readonly showTimeLeft: boolean;
};

export enum AutoResetMinutes {
    Default = 25,
    Min = 1,
    Max = 720,
}

export function resolveAutoReset({ enabled, minutes, showTimeLeft }: AutoResetSettings = {}): AutoResetPolicy {
    return {
        delay: enabled === true ? clampMinutes(minutes) * Duration.Minute : null,
        showTimeLeft: showTimeLeft !== false,
    };
}

function clampMinutes(minutes: number | undefined): number {
    if (minutes === undefined || !Number.isFinite(minutes)) {
        return AutoResetMinutes.Default;
    }
    return Math.min(AutoResetMinutes.Max, Math.max(AutoResetMinutes.Min, Math.round(minutes)));
}
