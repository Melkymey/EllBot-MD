# EllBot-MD

A WhatsApp bot built with [Baileys](https://github.com/WhiskeySockets/Baileys) plus a small Express status page.

## Project Structure

- `index.js` — entry point; starts the bot and the status web server
- `main.js` — WhatsApp socket using Baileys, prints a QR code in the console for pairing
- `web/server.js` — Express status page (`GET /` → "EllBot-MD Online")
- `config.js` — bot config (name, owner, prefix, autoRead)
- `lib/` — `handler.js`, `database.js`, `punglin.js` (menu)
- `plugins/` — auto-loaded commands: `ai`, `antilink`, `level`, `menu`, `ping`, `tiktok`
- `database/users.json` — JSON user store (xp, level, limit)

## Replit Setup

- Runtime: Node.js 20
- Workflow `Start application`: `node index.js`
- Web status page binds `0.0.0.0:5000` (Replit-required host/port for the preview)
- WhatsApp pairing QR is printed to the workflow console — open the workflow logs and scan it with WhatsApp on your phone (Settings → Linked Devices). The session is persisted in `./session/`.
- Deployment: VM (always-on), since the WhatsApp socket must stay connected.

## Dependencies

`@whiskeysockets/baileys`, `axios`, `express`, `pino`, `qrcode`, `qrcode-terminal`.
