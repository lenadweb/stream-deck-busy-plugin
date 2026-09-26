import { Appearance } from "../appearance/appearance";
import { paintBackground } from "./background";
import { paintIcon } from "./icons/icon-registry";
import { layoutFor } from "./layout";
import { Surface } from "./surface";
import { svgDocument, SvgMarkup } from "./svg";
import { paintText } from "./text/paint-text";
import { palettes } from "./tokens";

export function renderTile({ status, icon, text }: Appearance, surface: Surface): SvgMarkup {
    const palette = palettes[status];
    const slots = layoutFor(surface.kind, { hasIcon: icon !== null, hasText: text !== null });

    const background = paintBackground(surface, palette);
    const iconLayer = icon !== null && slots.icon ? paintIcon(icon, slots.icon, palette) : "";
    const textLayer = text !== null && slots.text ? paintText(text, slots.text) : "";

    return svgDocument(surface.width, surface.height, background + iconLayer + textLayer);
}
