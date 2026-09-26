import { IconNode, SVGProps } from "lucide";
import { Attributes, AttributeValue, element, formatNumber } from "../svg";
import { foreground, iconography } from "../tokens";
import { IconPainter } from "./icon-painter";

export function lucideIcon(node: IconNode): IconPainter {
    const shapes = node.map(([tag, attributes]) => element(tag, definedAttributes(attributes))).join("");

    return ({ cx, cy, size }) => element(
        "g",
        {
            transform: `translate(${formatNumber(cx - size / 2)} ${formatNumber(cy - size / 2)}) scale(${formatNumber(size / iconography.glyphGrid)})`,
            fill: "none",
            stroke: foreground,
            "stroke-width": iconography.glyphStroke,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
        },
        shapes,
    );
}

function definedAttributes(attributes: SVGProps): Attributes {
    return Object.fromEntries(
        Object.entries(attributes).filter((entry): entry is [string, AttributeValue] => entry[1] !== undefined),
    );
}
