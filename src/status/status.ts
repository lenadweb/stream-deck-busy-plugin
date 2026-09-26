export enum Status {
    Free = "free",
    Busy = "busy",
}

const STATUSES: readonly string[] = Object.values(Status);

export function isStatus(value: unknown): value is Status {
    return typeof value === "string" && STATUSES.includes(value);
}

export function toggled(status: Status): Status {
    return status === Status.Busy ? Status.Free : Status.Busy;
}

export function statusFromRotation(ticks: number): Status {
    return ticks > 0 ? Status.Busy : Status.Free;
}
