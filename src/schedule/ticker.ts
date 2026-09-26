import { Milliseconds } from "./time";

export type TickHandler = () => void;

export class Ticker {
    private timer: NodeJS.Timeout | undefined;

    constructor(
        private readonly interval: Milliseconds,
        private readonly onTick: TickHandler,
    ) {}

    start(): void {
        this.timer ??= setInterval(this.onTick, this.interval);
    }

    stop(): void {
        clearInterval(this.timer);
        this.timer = undefined;
    }
}
