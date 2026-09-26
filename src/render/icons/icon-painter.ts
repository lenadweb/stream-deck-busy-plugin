import { IconSlot } from "../layout";
import { SvgMarkup } from "../svg";
import { Palette } from "../tokens";

export type IconPainter = (slot: IconSlot, palette: Palette) => SvgMarkup;
