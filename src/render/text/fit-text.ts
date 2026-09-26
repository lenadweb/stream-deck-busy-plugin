import { TextSlot } from "../layout";
import { typography } from "../tokens";
import { measureText } from "./measure-text";

export type FittedText = {
    readonly lines: readonly string[];
    readonly fontSize: number;
};

const SINGLE_LINE_MIN_SCALE = 0.6;

export function fitText(value: string, slot: TextSlot): FittedText {
    return fitOnOneLine(value, slot) ?? fitWrapped(value, slot);
}

function fitOnOneLine(value: string, slot: TextSlot): FittedText | null {
    const smallest = Math.max(slot.minFont, Math.ceil(slot.maxFont * SINGLE_LINE_MIN_SCALE));
    for (let fontSize = slot.maxFont; fontSize >= smallest; fontSize--) {
        if (fits([value], fontSize, slot)) {
            return { lines: [value], fontSize };
        }
    }
    return null;
}

function fitWrapped(value: string, slot: TextSlot): FittedText {
    for (let fontSize = slot.maxFont; fontSize > slot.minFont; fontSize--) {
        const lines = wrap(value, fontSize, slot.maxWidth);
        if (fits(lines, fontSize, slot)) {
            return { lines, fontSize };
        }
    }
    return { lines: wrap(value, slot.minFont, slot.maxWidth), fontSize: slot.minFont };
}

function fits(lines: readonly string[], fontSize: number, slot: TextSlot): boolean {
    const widest = Math.max(...lines.map((line) => measureText(line, fontSize)));
    const height = lines.length * fontSize * typography.lineHeight;
    return widest <= slot.maxWidth && height <= slot.maxHeight;
}

function wrap(value: string, fontSize: number, maxWidth: number): string[] {
    const words = value.split(/\s+/).filter(Boolean);
    return words.reduce<string[]>((lines, word) => {
        const current = lines.at(-1);
        if (current !== undefined && measureText(`${current} ${word}`, fontSize) <= maxWidth) {
            lines[lines.length - 1] = `${current} ${word}`;
        } else {
            lines.push(word);
        }
        return lines;
    }, []);
}
