const { downloadContentFromMessage } = require("@whiskeysockets/baileys")
const sharp = require("sharp")

module.exports = {
  command: ["sticker", "s"],
  desc: "ubh sticker",

  execute: async (sock, m) => {
    try {
      if (!m.message) return

      const from = m.key.remoteJid

      const text =
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        ""

      const isCommand = text.startsWith(".") || text.startsWith("!") || text.startsWith("/")

      let imageMessage = null

      // 🔥 Ambil gambar (langsung / reply)
      if (m.message.imageMessage) {
        imageMessage = m.message.imageMessage
      } else if (
        m.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
      ) {
        imageMessage =
          m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
      }

      // ❌ kalau tidak ada gambar
      if (!imageMessage) {
        if (isCommand) {
          return sock.sendMessage(from, {
            text: "❌ Kirim atau reply gambar dengan .sticker"
          })
        }
        return
      }

      console.log("📸 Gambar terdeteksi")

      // 🔥 Download gambar
      const stream = await downloadContentFromMessage(imageMessage, "image")

      let buffer = Buffer.from([])
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
      }

      // 🔥 Convert ke sticker
      const sticker = await sharp(buffer)
        .resize(512, 512, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .webp()
        .toBuffer()

      await sock.sendMessage(from, { sticker })

    } catch (err) {
      console.log("❌ Sticker error:", err)
    }
  }
}
