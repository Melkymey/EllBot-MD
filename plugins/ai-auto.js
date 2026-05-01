const axios = require("axios")
const aiSession = require("../ai-session")

module.exports = {
  command: [], // tetap kosong → biar tidak muncul di menu
  desc: "AI auto reply (tanpa command)",

  execute: async (sock, m) => {
    if (!m.message) return

    const from = m.key.remoteJid

    const text =
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      ""

    // ❌ skip kalau kosong
    if (!text) return

    // ❌ skip kalau command (biar gak ganggu .menu dll)
    if (text.startsWith(".")) return

    // ❌ kalau AI belum ON
    if (!aiSession.isOn(from)) return

    let reply = null

    // 🔥 API 1
    try {
      const res1 = await axios.get(
        "https://api.affiliateplus.xyz/api/chatbot",
        {
          params: {
            message: text,
            botname: "EllBot",
            ownername: "User"
          },
          timeout: 5000
        }
      )

      reply = res1.data.message
      console.log("✅ API 1 jalan")

    } catch (err) {
      console.log("❌ API 1 mati")
    }

    // 🔥 API 2 (fallback)
    if (!reply) {
      try {
        const res2 = await axios.post(
          "https://api.simsimi.vn/v2/simtalk",
          new URLSearchParams({
            text: text,
            lc: "id"
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 5000
          }
        )

        reply = res2.data.message
        console.log("✅ API 2 jalan")

      } catch (err) {
        console.log("❌ API 2 mati")
      }
    }

    // 🔥 HASIL
    if (reply) {
      await sock.sendMessage(from, {
        text: "🤖 " + reply
      })
    } else {
      await sock.sendMessage(from, {
        text: "❌ Semua AI lagi down, coba lagi nanti 😢"
      })
    }
  }
}
