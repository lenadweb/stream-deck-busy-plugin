import { Milliseconds, now, Timestamp } from "../schedule/time";
import { Status } from "./status";

export type StatusSnapshot = {
    readonly status: Status;
    readonly resetAt: Timestamp | null;
};

export const INITIAL_SNAPSHOT: StatusSnapshot = { status: Status.Free, resetAt: null };

export function snapshotOf(status: Status, resetAfter: Milliseconds | null): StatusSnapshot {
    const resetAt = status === Status.Busy && resetAfter !== null ? now() + resetAfter : null;
    return { status, resetAt };
}

export function isExpired({ resetAt }: StatusSnapshot, at: Timestamp): boolean {
    return resetAt !== null && resetAt <= at;
}
