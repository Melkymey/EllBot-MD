const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const qrcode = require("qrcode-terminal")
const QRCode = require("qrcode")
const P = require("pino")

// ✅ TAMBAHAN HANDLER
const handler = require("./handler")

// DETEKSI PLATFORM
const isRailway = !!process.env.RAILWAY_ENVIRONMENT
const isReplit = !!process.env.REPL_ID

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    browser: ["EllBot", "Chrome", "1.0.0"]
  })

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update

    // 🔥 QR HANDLER
    if (qr) {
      console.clear()
      console.log("📲 Scan QR WhatsApp:\n")

      if (isRailway) {
        const url = await QRCode.toDataURL(qr)
        console.log("🌐 Buka ini di browser:\n")
        console.log(url)
      } else {
        qrcode.generate(qr, { small: true })
      }
    }

    // ✅ CONNECTED
    if (connection === "open") {
      console.clear()
      console.log("✅ BOT CONNECTED")
    }

    // ❌ DISCONNECT
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode

      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Session logout, scan ulang QR")
      } else {
        console.log("🔄 Reconnecting...")
        setTimeout(startBot, 3000)
      }
    }
  })

  sock.ev.on("creds.update", saveCreds)

  // ✅ TAMBAHAN LISTENER PESAN
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0]
    await handler(sock, m)
  })
}

startBot()
