const fs = require("fs")
const { getMedia } = require("../lib/media")

module.exports = {
  command: ["menu"],
  desc: "Menampilkan menu bot",

  execute: async (sock, m) => {
    const from = m.key.remoteJid

    const files = fs.readdirSync(__dirname)

    let fitur = []

    for (let file of files) {
      try {
        const plugin = require("./" + file)

        if (plugin.command && plugin.command.length > 0) {
          plugin.command.forEach(cmd => {
            fitur.push({
              cmd: "." + cmd,
              desc: plugin.desc || "Tidak ada deskripsi"
            })
          })
        }
      } catch {}
    }

    // 🔥 biar rapi (urut A-Z)
    fitur.sort((a, b) => a.cmd.localeCompare(b.cmd))

    const teks = `
╭━━━〔 *EllBot-MD 🤖* 〕━━━⬣
│ 👤 Owner: 6281245695410
╰━━━━━━━━━━━━━━━━⬣

📌 *MENU BOT*

${fitur.map(v => `➤ ${v.cmd} → ${v.desc}`).join("\n")}

╭━━━〔 *FITUR OTOMATIS* 〕━━━⬣
➤ Kirim / reply gambar = jadi sticker 🤖
➤ AI auto (kalau sudah di ON)
╰━━━━━━━━━━━━━━━━⬣
`

    const gambar = getMedia("menu.jpg")

    if (!gambar) {
      return sock.sendMessage(from, {
        text: "❌ Gambar menu tidak ditemukan"
      })
    }

    await sock.sendMessage(from, {
      image: gambar,
      caption: teks
    })
  }
}
