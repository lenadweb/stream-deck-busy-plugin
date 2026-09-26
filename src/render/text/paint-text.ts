import { TextSlot } from "../layout";
import { element, escapeXml, SvgMarkup } from "../svg";
import { foreground, typography } from "../tokens";
import { fitText } from "./fit-text";

export function paintText(value: string, slot: TextSlot): SvgMarkup {
    const { lines, fontSize } = fitText(value, slot);
    const lineHeight = fontSize * typography.lineHeight;
    const top = slot.cy - (lines.length * lineHeight) / 2;

    return lines
        .map((line, index) => element(
            "text",
            {
                x: slot.cx,
                y: top + lineHeight * (index + 0.5) + fontSize * typography.baselineShift,
                "font-family": typography.family,
                "font-size": fontSize,
                "font-weight": typography.weight,
                fill: foreground,
                "text-anchor": "middle",
            },
            escapeXml(line),
        ))
        .join("");
}
