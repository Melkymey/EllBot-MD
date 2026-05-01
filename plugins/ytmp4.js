const axios = require("axios")

module.exports = {
  command: ["ytmp4"],
  desc: "video",

  execute: async (sock, m, args) => {
    const from = m.key.remoteJid
    const url = args[0]

    if (!url) {
      return sock.sendMessage(from, {
        text: "❌ Masukkan link"
      })
    }

    try {
      await sock.sendMessage(from, { text: "⏳ Download video..." })

      const res = await axios.get(`https://api.vevioz.com/api/button/mp4/${url}`)

      await sock.sendMessage(from, {
        text: `🎬 Klik untuk download:\n${res.data}`
      })

    } catch (err) {
      sock.sendMessage(from, {
        text: "❌ Gagal download video"
      })
    }
  }
}
