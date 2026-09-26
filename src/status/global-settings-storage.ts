import streamDeck from "@elgato/streamdeck";
import { Timestamp } from "../schedule/time";
import { isStatus, Status } from "./status";
import { StatusSnapshot } from "./status-snapshot";
import { StatusStorage } from "./status-store";

type GlobalSettings = {
    status?: Status;
    resetAt?: Timestamp | null;
};

export const globalSettingsStorage: StatusStorage = {
    async read() {
        try {
            const { status, resetAt } = await streamDeck.settings.getGlobalSettings<GlobalSettings>();
            return isStatus(status) ? { status, resetAt: typeof resetAt === "number" ? resetAt : null } : undefined;
        } catch (error) {
            streamDeck.logger.error(`Failed to read the stored status: ${String(error)}`);
            return undefined;
        }
    },

    async write({ status, resetAt }: StatusSnapshot) {
        await streamDeck.settings.setGlobalSettings<GlobalSettings>({ status, resetAt });
    },
};
