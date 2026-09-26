import streamDeck, {
    action,
    DialAction,
    DidReceiveSettingsEvent,
    DialRotateEvent,
    KeyAction,
    SingletonAction,
    WillAppearEvent,
    WillDisappearEvent,
} from "@elgato/streamdeck";
import { resolveAppearance } from "../appearance/appearance";
import { BusySettings } from "../appearance/busy-settings";
import { ActionUuid, FeedbackSlot } from "../manifest";
import { DIAL_SURFACE, KEY_SURFACE, renderTile, toDataUrl } from "../render";
import { statusFromRotation } from "../status/status";
import { StatusStore } from "../status/status-store";

type BusyAction = DialAction<BusySettings> | KeyAction<BusySettings>;

type ActionId = BusyAction["id"];

@action({ UUID: ActionUuid.BusyToggle })
export class BusyToggleAction extends SingletonAction<BusySettings> {
    private readonly settings = new Map<ActionId, BusySettings>();

    constructor(private readonly store: StatusStore) {
        super();
        store.subscribe(() => void this.repaintAll());
    }

    override async onWillAppear(ev: WillAppearEvent<BusySettings>): Promise<void> {
        this.settings.set(ev.action.id, ev.payload.settings);
        await this.store.load();
        await this.repaint(ev.action);
    }

    override onWillDisappear(ev: WillDisappearEvent<BusySettings>): void {
        this.settings.delete(ev.action.id);
    }

    override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<BusySettings>): Promise<void> {
        this.settings.set(ev.action.id, ev.payload.settings);
        await this.repaint(ev.action);
    }

    override onKeyDown(): Promise<void> {
        return this.store.toggle();
    }

    override onDialDown(): Promise<void> {
        return this.store.toggle();
    }

    override onTouchTap(): Promise<void> {
        return this.store.toggle();
    }

    override onDialRotate(ev: DialRotateEvent<BusySettings>): Promise<void> {
        return this.store.set(statusFromRotation(ev.payload.ticks));
    }

    private async repaintAll(): Promise<void> {
        await Promise.all([...this.actions].map((target) => this.repaint(target)));
    }

    private async repaint(target: BusyAction): Promise<void> {
        const appearance = resolveAppearance(this.store.current, this.settings.get(target.id) ?? {});
        try {
            if (target.isDial()) {
                await target.setFeedback({ [FeedbackSlot.FullView]: toDataUrl(renderTile(appearance, DIAL_SURFACE)) });
            } else {
                await target.setImage(toDataUrl(renderTile(appearance, KEY_SURFACE)));
            }
        } catch (error) {
            streamDeck.logger.error(`Failed to repaint ${target.id}: ${String(error)}`);
        }
    }
}
