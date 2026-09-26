import { element } from "../svg";
import { foreground, iconography } from "../tokens";
import { IconPainter } from "./icon-painter";

export const paintNoEntry: IconPainter = ({ cx, cy, size }, palette) => {
    const barWidth = size * iconography.noEntryBarWidthRatio;
    const barHeight = size * iconography.noEntryBarHeightRatio;

    const disc = element("circle", { cx, cy, r: size / 2, fill: foreground });
    const bar = element("rect", {
        x: cx - barWidth / 2,
        y: cy - barHeight / 2,
        width: barWidth,
        height: barHeight,
        rx: barHeight / 2,
        fill: palette.ink,
    });
    return disc + bar;
};
