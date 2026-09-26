import { Status } from "../status/status";
import { BusySettings, StateSettings } from "./busy-settings";
import { IconName, isIconName, NO_ICON } from "./icon";

export type Appearance = {
    status: Status;
    icon: IconName | null;
    text: string | null;
};

type StateDefaults = {
    icon: IconName;
    text: string;
};

const DEFAULTS: Record<Status, StateDefaults> = {
    [Status.Free]: { icon: IconName.Check, text: "FREE" },
    [Status.Busy]: { icon: IconName.NoEntry, text: "BUSY" },
};

export function resolveAppearance(status: Status, settings: BusySettings): Appearance {
    const state = settings[status] ?? {};
    const defaults = DEFAULTS[status];
    return {
        status,
        icon: resolveIcon(state, defaults),
        text: resolveText(state, defaults),
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
