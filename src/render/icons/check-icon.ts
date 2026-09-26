import { element, formatNumber } from "../svg";
import { foreground, iconography } from "../tokens";
import { IconPainter } from "./icon-painter";

type Offset = readonly [dx: number, dy: number];

const CHECK_POINTS: readonly Offset[] = [
    [-0.42, 0.02],
    [-0.12, 0.32],
    [0.44, -0.26],
];

export const paintCheck: IconPainter = ({ cx, cy, size }) => {
    const radius = size / 2;
    const stroke = size * iconography.checkStrokeRatio;
    const path = CHECK_POINTS
        .map(([dx, dy], index) => `${index === 0 ? "M" : "L"} ${formatNumber(cx + dx * radius)} ${formatNumber(cy + dy * radius)}`)
        .join(" ");

    const ring = element("circle", {
        cx,
        cy,
        r: radius - stroke / 2,
        fill: foreground,
        "fill-opacity": iconography.checkFillOpacity,
        stroke: foreground,
        "stroke-width": stroke,
    });
    const mark = element("path", {
        d: path,
        fill: "none",
        stroke: foreground,
        "stroke-width": stroke,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
    });
    return ring + mark;
};
