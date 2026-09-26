export type Milliseconds = number;

export type Timestamp = number;

export enum Duration {
    Second = 1000,
    Minute = 60 * Second,
    Hour = 60 * Minute,
}

export function now(): Timestamp {
    return Date.now();
}
