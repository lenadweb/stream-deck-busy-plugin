import streamDeck, {
    action,
    DialAction,
    DialDownEvent,
    DialRotateEvent,
    DidReceiveSettingsEvent,
    KeyAction,
    KeyDownEvent,
    SingletonAction,
    TouchTapEvent,
    WillAppearEvent,
    WillDisappearEvent,
} from "@elgato/streamdeck";
import { resolveAppearance } from "../appearance/appearance";
import { ActionUuid, FeedbackSlot } from "../manifest";
import { DIAL_SURFACE, KEY_SURFACE, renderTile, toDataUrl } from "../render";
import { resolveAutoReset } from "../schedule/auto-reset";
import { Ticker } from "../schedule/ticker";
import { Duration, Milliseconds, now } from "../schedule/time";
import { BusySettings } from "../settings/busy-settings";
import { statusFromRotation } from "../status/status";
import { StatusSnapshot } from "../status/status-snapshot";
import { StatusStore } from "../status/status-store";

type BusyAction = DialAction<BusySettings> | KeyAction<BusySettings>;

type ActionId = BusyAction["id"];

type ImageDataUrl = string;

@action({ UUID: ActionUuid.BusyToggle })
export class BusyToggleAction extends SingletonAction<BusySettings> {
    private readonly settings = new Map<ActionId, BusySettings>();
    private readonly painted = new Map<ActionId, ImageDataUrl>();
    private readonly countdown = new Ticker(Duration.Second, () => void this.repaintAll());

    constructor(private readonly store: StatusStore) {
        super();
        store.subscribe((snapshot) => this.onStatusChange(snapshot));
    }

    override async onWillAppear(ev: WillAppearEvent<BusySettings>): Promise<void> {
        this.settings.set(ev.action.id, ev.payload.settings);
        await this.store.load();
        await this.repaint(ev.action);
    }

    override onWillDisappear(ev: WillDisappearEvent<BusySettings>): void {
        this.settings.delete(ev.action.id);
        this.painted.delete(ev.action.id);
    }

    override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<BusySettings>): Promise<void> {
        this.settings.set(ev.action.id, ev.payload.settings);
        await this.repaint(ev.action);
    }

    override onKeyDown(ev: KeyDownEvent<BusySettings>): Promise<void> {
        return this.store.toggle(this.resetDelayOf(ev.action.id));
    }

    override onDialDown(ev: DialDownEvent<BusySettings>): Promise<void> {
        return this.store.toggle(this.resetDelayOf(ev.action.id));
    }

    override onTouchTap(ev: TouchTapEvent<BusySettings>): Promise<void> {
        return this.store.toggle(this.resetDelayOf(ev.action.id));
    }

    override onDialRotate(ev: DialRotateEvent<BusySettings>): Promise<void> {
        return this.store.set(statusFromRotation(ev.payload.ticks), this.resetDelayOf(ev.action.id));
    }

    private onStatusChange({ resetAt }: StatusSnapshot): void {
        if (resetAt === null) {
            this.countdown.stop();
        } else {
            this.countdown.start();
        }
        void this.repaintAll();
    }

    private resetDelayOf(id: ActionId): Milliseconds | null {
        return resolveAutoReset(this.settingsOf(id).autoReset).delay;
    }

    private settingsOf(id: ActionId): BusySettings {
        return this.settings.get(id) ?? {};
    }

    private async repaintAll(): Promise<void> {
        await Promise.all([...this.actions].map((target) => this.repaint(target)));
    }

    private async repaint(target: BusyAction): Promise<void> {
        const appearance = resolveAppearance(this.store.current, this.settingsOf(target.id), now());
        const surface = target.isDial() ? DIAL_SURFACE : KEY_SURFACE;
        const image = toDataUrl(renderTile(appearance, surface));
        if (this.painted.get(target.id) === image) {
            return;
        }

        try {
            if (target.isDial()) {
                await target.setFeedback({ [FeedbackSlot.FullView]: image });
            } else {
                await target.setImage(image);
            }
            this.painted.set(target.id, image);
        } catch (error) {
            streamDeck.logger.error(`Failed to repaint ${target.id}: ${String(error)}`);
        }
    }
}
