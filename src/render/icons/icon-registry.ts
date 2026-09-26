import { BellOff, Coffee, DoorOpen, Headphones, Lock, Mic, Moon, Phone, Smile, Video } from "lucide";
import { IconName } from "../../appearance/icon";
import { IconSlot } from "../layout";
import { SvgMarkup } from "../svg";
import { Palette } from "../tokens";
import { paintCheck } from "./check-icon";
import { IconPainter } from "./icon-painter";
import { lucideIcon } from "./lucide-icon";
import { paintNoEntry } from "./no-entry-icon";

const painters: Readonly<Record<IconName, IconPainter>> = {
    [IconName.Check]: paintCheck,
    [IconName.NoEntry]: paintNoEntry,
    [IconName.Coffee]: lucideIcon(Coffee),
    [IconName.Smile]: lucideIcon(Smile),
    [IconName.DoorOpen]: lucideIcon(DoorOpen),
    [IconName.Headphones]: lucideIcon(Headphones),
    [IconName.Microphone]: lucideIcon(Mic),
    [IconName.Video]: lucideIcon(Video),
    [IconName.Phone]: lucideIcon(Phone),
    [IconName.Moon]: lucideIcon(Moon),
    [IconName.Lock]: lucideIcon(Lock),
    [IconName.BellOff]: lucideIcon(BellOff),
};

export function paintIcon(name: IconName, slot: IconSlot, palette: Palette): SvgMarkup {
    return painters[name](slot, palette);
}
