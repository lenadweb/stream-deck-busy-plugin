import { Status } from "../status/status";
import { IconChoice } from "./icon";

export type StateSettings = {
    icon?: IconChoice;
    text?: string;
    showText?: boolean;
};

export type BusySettings = Partial<Record<Status, StateSettings>>;
