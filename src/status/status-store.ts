import { Milliseconds, now } from "../schedule/time";
import { Status, toggled } from "./status";
import { INITIAL_SNAPSHOT, isExpired, snapshotOf, StatusSnapshot } from "./status-snapshot";

export interface StatusStorage {
    read(): Promise<StatusSnapshot | undefined>;
    write(snapshot: StatusSnapshot): Promise<void>;
}

export type StatusListener = (snapshot: StatusSnapshot) => void;

export type Unsubscribe = () => void;

export class StatusStore {
    private snapshot: StatusSnapshot = INITIAL_SNAPSHOT;
    private loading: Promise<void> | undefined;
    private resetTimer: NodeJS.Timeout | undefined;
    private readonly listeners = new Set<StatusListener>();

    constructor(private readonly storage: StatusStorage) {}

    get current(): StatusSnapshot {
        return this.snapshot;
    }

    load(): Promise<void> {
        this.loading ??= this.storage.read().then((stored) => this.restore(stored));
        return this.loading;
    }

    async toggle(resetAfter: Milliseconds | null): Promise<void> {
        await this.load();
        await this.set(toggled(this.snapshot.status), resetAfter);
    }

    async set(status: Status, resetAfter: Milliseconds | null): Promise<void> {
        await this.load();
        if (status === this.snapshot.status) {
            return;
        }
        this.replace(snapshotOf(status, resetAfter));
        await this.storage.write(this.snapshot);
    }

    subscribe(listener: StatusListener): Unsubscribe {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private restore(stored: StatusSnapshot | undefined): void {
        if (stored && !isExpired(stored, now())) {
            this.replace(stored);
        }
    }

    private replace(snapshot: StatusSnapshot): void {
        this.snapshot = snapshot;
        this.scheduleReset();
        this.listeners.forEach((listener) => listener(snapshot));
    }

    private scheduleReset(): void {
        clearTimeout(this.resetTimer);
        this.resetTimer = undefined;

        const { resetAt } = this.snapshot;
        if (resetAt !== null) {
            this.resetTimer = setTimeout(() => void this.expire(), Math.max(0, resetAt - now()));
        }
    }

    private async expire(): Promise<void> {
        this.replace(INITIAL_SNAPSHOT);
        await this.storage.write(this.snapshot);
    }
}
