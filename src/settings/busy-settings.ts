import { IconChoice } from "../appearance/icon";
import { Status } from "../status/status";

export type StateSettings = {
    icon?: IconChoice;
    text?: string;
    showText?: boolean;
};

export type AutoResetSettings = {
    enabled?: boolean;
    minutes?: number;
    showTimeLeft?: boolean;
};

export type BusySettings = {
    [Status.Free]?: StateSettings;
    [Status.Busy]?: StateSettings;
    autoReset?: AutoResetSettings;
};
