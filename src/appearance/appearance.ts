import { resolveAutoReset } from "../schedule/auto-reset";
import { formatTimeLeft } from "../schedule/time-left";
import { Timestamp } from "../schedule/time";
import { BusySettings, StateSettings } from "../settings/busy-settings";
import { Status } from "../status/status";
import { StatusSnapshot } from "../status/status-snapshot";
import { IconName, isIconName, NO_ICON } from "./icon";

export type Appearance = {
    readonly status: Status;
    readonly icon: IconName | null;
    readonly text: string | null;
};

type StateDefaults = {
    readonly icon: IconName;
    readonly text: string;
};

const DEFAULTS: Readonly<Record<Status, StateDefaults>> = {
    [Status.Free]: { icon: IconName.Check, text: "FREE" },
    [Status.Busy]: { icon: IconName.NoEntry, text: "BUSY" },
};

export function resolveAppearance(snapshot: StatusSnapshot, settings: BusySettings, at: Timestamp): Appearance {
    const state = settings[snapshot.status] ?? {};
    const defaults = DEFAULTS[snapshot.status];
    return {
        status: snapshot.status,
        icon: resolveIcon(state, defaults),
        text: resolveTimeLeft(snapshot, settings, at) ?? resolveText(state, defaults),
    };
}

function resolveIcon({ icon }: StateSettings, defaults: StateDefaults): IconName | null {
    if (icon === NO_ICON) {
        return null;
    }
    return isIconName(icon) ? icon : defaults.icon;
}

function resolveText({ text, showText }: StateSettings, defaults: StateDefaults): string | null {
    if (showText === false) {
        return null;
    }
    return text?.trim() || defaults.text;
}

function resolveTimeLeft({ resetAt }: StatusSnapshot, settings: BusySettings, at: Timestamp): string | null {
    if (resetAt === null || !resolveAutoReset(settings.autoReset).showTimeLeft) {
        return null;
    }
    return formatTimeLeft(resetAt - at);
}
