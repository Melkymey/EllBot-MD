const aiSession = require("../ai-session")

module.exports = {
  command: ["ai"],
  desc: "AI ON/OFF",
  execute: async (sock, m, args) => {
    const from = m.key.remoteJid
    const input = args[0]?.toLowerCase()

    // 🔥 ON
    if (input === "on") {
      aiSession.setOn(from)
      return sock.sendMessage(from, {
        text: "✅ AI berhasil diaktifkan\nSekarang tinggal chat biasa aja 🤖"
      })
    }

    // 🔥 OFF
    if (input === "off") {
      aiSession.setOff(from)
      return sock.sendMessage(from, {
        text: "❌ AI dimatikan"
      })
    }

    // 🔥 DEFAULT
    await sock.sendMessage(from, {
      text: `🤖 *MODE AI*

Gunakan:
.ai on → Aktifkan AI
.ai off → Matikan AI`
    })
  }
}
