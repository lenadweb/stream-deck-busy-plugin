import streamDeck from "@elgato/streamdeck";
import { BusyToggleAction } from "./actions/busy-toggle";

streamDeck.actions.registerAction(new BusyToggleAction());

streamDeck.connect();
