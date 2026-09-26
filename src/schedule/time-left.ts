import { Duration, Milliseconds } from "./time";

export function formatTimeLeft(remaining: Milliseconds): string {
    const totalSeconds = Math.max(0, Math.ceil(remaining / Duration.Second));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return hours > 0
        ? `${hours}:${pad(minutes)}:${pad(seconds)}`
        : `${minutes}:${pad(seconds)}`;
}

function pad(value: number): string {
    return String(value).padStart(2, "0");
}
