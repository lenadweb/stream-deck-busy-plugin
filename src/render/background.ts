import { Size } from "./surface";
import { element, SvgMarkup } from "./svg";
import { HexColor, Palette, sheen } from "./tokens";

enum PaintId {
    Gradient = "background",
    Sheen = "sheen",
}

export function paintBackground({ width, height }: Size, palette: Palette): SvgMarkup {
    const definitions = element("defs", {}, gradient(palette) + highlight());
    const fill = element("rect", { width, height, fill: reference(PaintId.Gradient) });
    const shine = element("rect", { width, height, fill: reference(PaintId.Sheen) });
    return definitions + fill + shine;
}

function gradient({ gradientStart, gradientEnd }: Palette): SvgMarkup {
    return element(
        "linearGradient",
        { id: PaintId.Gradient, x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
        stop("0%", gradientStart) + stop("100%", gradientEnd),
    );
}

function highlight(): SvgMarkup {
    return element(
        "radialGradient",
        { id: PaintId.Sheen, cx: "30%", cy: "0%", r: "90%" },
        stop("0%", sheen.color, sheen.opacity) + stop("100%", sheen.color, 0),
    );
}

function stop(offset: string, color: HexColor, opacity = 1): SvgMarkup {
    return element("stop", { offset, "stop-color": color, "stop-opacity": opacity });
}

function reference(id: PaintId): string {
    return `url(#${id})`;
}
