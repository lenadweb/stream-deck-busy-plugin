import { Status, toggled } from "./status";

export interface StatusStorage {
    read(): Promise<Status | undefined>;
    write(status: Status): Promise<void>;
}

export type StatusListener = (status: Status) => void;

export type Unsubscribe = () => void;

export class StatusStore {
    private status: Status = Status.Free;
    private loading: Promise<void> | undefined;
    private readonly listeners = new Set<StatusListener>();

    constructor(private readonly storage: StatusStorage) {}

    get current(): Status {
        return this.status;
    }

    load(): Promise<void> {
        this.loading ??= this.storage.read().then((stored) => {
            this.status = stored ?? this.status;
        });
        return this.loading;
    }

    async toggle(): Promise<void> {
        await this.load();
        await this.set(toggled(this.status));
    }

    async set(status: Status): Promise<void> {
        await this.load();
        if (status === this.status) {
            return;
        }
        this.status = status;
        this.listeners.forEach((listener) => listener(status));
        await this.storage.write(status);
    }

    subscribe(listener: StatusListener): Unsubscribe {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
}
