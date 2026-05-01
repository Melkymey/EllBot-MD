const axios = require("axios")

module.exports = {
  command: ["tiktok", "tt"],
  desc: "Down vdeo tt",

  execute: async (sock, m, args) => {
    const from = m.key.remoteJid
    const url = args[0]

    // ❌ kalau tidak ada link
    if (!url) {
      return sock.sendMessage(from, {
        text: "❌ Masukkan link TikTok!\n\nContoh:\n.tiktok https://vt.tiktok.com/xxxx"
      })
    }

    try {
      // 🔄 loading
      await sock.sendMessage(from, {
        text: "⏳ Sedang mengambil video..."
      })

      const res = await axios.get("https://tikwm.com/api/", {
        params: { url },
        timeout: 10000
      })

      const data = res.data.data

      if (!data || !data.play) {
        return sock.sendMessage(from, {
          text: "❌ Gagal mengambil video"
        })
      }

      // 🔥 pilih kualitas terbaik
      const videoUrl = data.hdplay || data.play

      await sock.sendMessage(from, {
        video: { url: videoUrl },
        caption: `🎬 *TikTok Downloader*\n\n👤 Author: ${data.author.nickname}`
      })

    } catch (err) {
      console.log("❌ TikTok error:", err)

      await sock.sendMessage(from, {
        text: "❌ Error mengambil video, coba lagi nanti"
      })
    }
  }
}
