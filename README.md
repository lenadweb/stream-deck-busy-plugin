# Busy Toggle

A one-press status light for your Stream Deck. **Green** means you are free and it's fine to come over. **Red** means you are busy, please do not disturb.

## Features

- **One-press toggle.** Press the key to switch between free and busy.
- **Keys and dials.** Works on standard keys (144×144) and on Stream Deck+ dials and the touchscreen (200×100).
- **Dial gestures.** Push or tap to toggle. Turn right for busy, turn left for free, whatever the current state.
- **Always in sync.** Every Busy Toggle key and dial shows the same status, and the status is kept across Stream Deck restarts.
- **Your words.** Rename either state, for example *On Air*, *In a meeting* or *Come in*, in any language. Long text wraps and shrinks to fit.
- **Readable from across the room.** The whole tile is solid green or red, with a check or a "no entry" sign.

## Controls

| Control | Action |
| --- | --- |
| Key press | Toggle free / busy |
| Dial push | Toggle free / busy |
| Touchscreen tap | Toggle free / busy |
| Dial turn right | Busy |
| Dial turn left | Free |

## Configuration

| Setting | Description |
| --- | --- |
| **Free text** | Text shown while you are free. Empty means `FREE`. |
| **Busy text** | Text shown while you are busy. Empty means `BUSY`. |

The text is set per key, so different keys can use different words. The status itself is shared by all of them.

## Development

```bash
npm install
npm run build      # one-off build
npm run watch      # rebuild and restart the plugin on change
npm run release    # bump the version, build and pack a .streamDeckPlugin
```

## License

[MIT](LICENSE) © lenadweb
