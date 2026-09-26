import streamDeck from "@elgato/streamdeck";
import { BusyToggleAction } from "./actions/busy-toggle-action";
import { globalSettingsStorage } from "./status/global-settings-storage";
import { StatusStore } from "./status/status-store";

const store = new StatusStore(globalSettingsStorage);

streamDeck.actions.registerAction(new BusyToggleAction(store));

streamDeck.connect();
