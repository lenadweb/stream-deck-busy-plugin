import streamDeck from "@elgato/streamdeck";
import { isStatus, Status } from "./status";
import { StatusStorage } from "./status-store";

type GlobalSettings = {
    status?: Status;
};

export const globalSettingsStorage: StatusStorage = {
    async read() {
        try {
            const { status } = await streamDeck.settings.getGlobalSettings<GlobalSettings>();
            return isStatus(status) ? status : undefined;
        } catch (error) {
            streamDeck.logger.error(`Failed to read the stored status: ${String(error)}`);
            return undefined;
        }
    },

    async write(status) {
        await streamDeck.settings.setGlobalSettings<GlobalSettings>({ status });
    },
};
