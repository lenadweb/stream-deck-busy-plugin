import streamDeck, {
    action,
    SingletonAction,
    DialAction,
    KeyAction,
    KeyDownEvent,
    DialDownEvent,
    DialRotateEvent,
    TouchTapEvent,
    WillAppearEvent,
    WillDisappearEvent,
    DidReceiveSettingsEvent,
} from "@elgato/streamdeck";
import { BusyGlobalSettings, BusySettings } from "../interfaces/settings";
import { BusyRenderer } from "../ui/busy-renderer";

@action({ UUID: "com.len.busy.toggle" })
export class BusyToggleAction extends SingletonAction<BusySettings> {
    private busy = false;
    private loaded: Promise<void> | undefined;
    private readonly settings = new Map<string, BusySettings>();
    private readonly renderer = new BusyRenderer();

    override async onWillAppear(ev: WillAppearEvent<BusySettings>): Promise<void> {
        this.settings.set(ev.action.id, ev.payload.settings ?? {});
        await this.load();
        await this.paint(ev.action);
    }

    override onWillDisappear(ev: WillDisappearEvent<BusySettings>): void {
        this.settings.delete(ev.action.id);
    }

    override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<BusySettings>): Promise<void> {
        this.settings.set(ev.action.id, ev.payload.settings ?? {});
        await this.paint(ev.action);
    }

    override async onKeyDown(_ev: KeyDownEvent<BusySettings>): Promise<void> {
        await this.setBusy(!this.busy);
    }

    override async onDialDown(_ev: DialDownEvent<BusySettings>): Promise<void> {
        await this.setBusy(!this.busy);
    }

    override async onTouchTap(_ev: TouchTapEvent<BusySettings>): Promise<void> {
        await this.setBusy(!this.busy);
    }

    override async onDialRotate(ev: DialRotateEvent<BusySettings>): Promise<void> {
        await this.setBusy(ev.payload.ticks > 0);
    }

    private load(): Promise<void> {
        this.loaded ??= streamDeck.settings
            .getGlobalSettings<BusyGlobalSettings>()
            .then((global) => {
                this.busy = global.busy === true;
            })
            .catch((err) => {
                streamDeck.logger.error(`Failed to read global settings: ${String(err)}`);
            });
        return this.loaded;
    }

    private async setBusy(busy: boolean): Promise<void> {
        if (busy === this.busy) {
            return;
        }
        this.busy = busy;
        await Promise.all([...this.actions].map((a) => this.paint(a)));
        await streamDeck.settings.setGlobalSettings<BusyGlobalSettings>({ busy });
    }

    private async paint(target: DialAction<BusySettings> | KeyAction<BusySettings>): Promise<void> {
        const settings = this.settings.get(target.id) ?? {};
        const text = this.busy ? settings.busyText : settings.freeText;
        try {
            if (target.isDial()) {
                await target.setFeedback({ full_view: this.toDataUrl(this.renderer.render(this.busy, text, 200, 100)) });
            } else {
                await target.setImage(this.toDataUrl(this.renderer.render(this.busy, text, 144, 144)));
            }
        } catch (err) {
            streamDeck.logger.error(`Render/update failed: ${String(err)}`);
        }
    }

    private toDataUrl(svg: string): string {
        return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    }
}
