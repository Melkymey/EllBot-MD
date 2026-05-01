const { spawn } = require("child_process")
const path = require("path")
const fs = require("fs")

module.exports = {
  command: ["nulis"],
  desc: "nulis di buku",

  execute: async (sock, m, args) => {
    const from = m.key.remoteJid
    const text = args.join(" ")

    if (!text) {
      return sock.sendMessage(from, {
        text: "❌ Contoh:\n.nulis2 Halo dunia"
      })
    }

    try {
      const inputPath = path.join(__dirname, "../media/kertas.jpg")
      const fontPath = path.join(__dirname, "../media/font.ttf")

      if (!fs.existsSync(inputPath) || !fs.existsSync(fontPath)) {
        return sock.sendMessage(from, {
          text: "❌ Gambar / font tidak ditemukan"
        })
      }

      const d = new Date()
      const tgl = d.toLocaleDateString("id-ID")
      const hari = d.toLocaleDateString("id-ID", { weekday: "long" })

      let bufs = []

      // 🔥 INI POSISI ASLI PUNYA KAMU (GAK DIUBAH)
      const argsMagick = [
        "convert",
        inputPath,

        "-font", fontPath,
        "-fill", "blue",
        "-pointsize", "20",
        "-annotate", "+806+78", hari,

        "-font", fontPath,
        "-fill", "blue",
        "-pointsize", "18",
        "-annotate", "+806+102", tgl,

        "-font", fontPath,
        "-fill", "blue",
        "-pointsize", "20",
        "-interline-spacing", "-7.5",
        "-annotate", "+344+142", text,

        "jpg:-"
      ]

      const proc = spawn("magick", argsMagick)

      proc.stdout.on("data", chunk => bufs.push(chunk))

      proc.on("close", async () => {
        await sock.sendMessage(from, {
          image: Buffer.concat(bufs),
          caption: "✍️ Lainkali nulis sendiri😎"
        })
      })

      proc.on("error", async () => {
        await sock.sendMessage(from, {
          text: "❌ ImageMagick tidak tersedia"
        })
      })

    } catch (err) {
      console.log(err)
      sock.sendMessage(from, {
        text: "❌ Error saat menulis"
      })
    }
  }
}
