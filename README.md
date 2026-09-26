# Busy Toggle

A one-press status light for your Stream Deck. **Green** means you are free and it's fine to come over. **Red** means you are busy, please do not disturb.

## Features

- **One-press toggle.** Press the key to switch between free and busy.
- **Keys and dials.** Works on standard keys (144×144) and on Stream Deck+ dials and the touchscreen (200×100).
- **Dial gestures.** Push or tap to toggle. Turn right for busy, turn left for free, whatever the current state.
- **Always in sync.** Every Busy Toggle key and dial shows the same status, and the status is kept across Stream Deck restarts.
- **Your icons.** Pick an icon for each state from 12 options (check, no entry, coffee, smile, door, headphones, microphone, video call, phone, moon, lock, muted bell), or none.
- **Your words.** Rename either state, for example *On Air*, *In a meeting* or *Come in*, in any language, or hide the text. Long text wraps and shrinks to fit.
- **Auto-reset.** Optionally return to free after a set number of minutes, with a live countdown on the key.
- **Readable from across the room.** The whole tile is solid green or red, so even a key with no icon and no text still shows your status.

## Controls

| Control | Action |
| --- | --- |
| Key press | Toggle free / busy |
| Dial push | Toggle free / busy |
| Touchscreen tap | Toggle free / busy |
| Dial turn right | Busy |
| Dial turn left | Free |

## Configuration

Each state, **Free** and **Busy**, has its own settings:

| Setting | Description |
| --- | --- |
| **Icon** | Icon shown on the tile, or *No icon*. Defaults to a check for free and a "no entry" sign for busy. |
| **Text** | Text shown on the tile. Empty means `FREE` / `BUSY`. |
| **Show** | Untick to hide the text and show only the icon, or only the colour. |

The **Advanced** tab holds the auto-reset timer:

| Setting | Description |
| --- | --- |
| **Return to Free automatically** | When this key or dial switches you to busy, go back to free after the set time. Off by default. |
| **After, minutes** | Timer length, 1–720 minutes. Defaults to 25. |
| **Show time left instead of text** | Replace the busy text with a countdown while the timer runs. On by default. |

Switching back to free by hand cancels the timer. A running timer survives Stream Deck restarts.

Settings are per key, so different keys can look different and use different timers, for example a 25-minute focus key next to a 60-minute meeting key. The status itself is shared by all of them.

## Development

```bash
npm install
npm run build      # one-off build
npm run link       # install the local build into Stream Deck
npm run unlink     # remove it from Stream Deck
npm run watch      # rebuild and restart the plugin on change
npm run release    # bump the version, build and pack a .streamDeckPlugin
```

## License

[MIT](LICENSE) © lenadweb
