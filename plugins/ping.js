module.exports = {
  command: ["ping"],
  desc: "Cek respon bot",

  execute: async (sock, m) => {
    const start = Date.now()

    await sock.sendMessage(m.key.remoteJid, {
      text: "aktif sayang 🥰..."
    })

    const speed = Date.now() - start

    await sock.sendMessage(m.key.remoteJid, {
      text: `🏓 Pong!\n⚡ Speed: ${speed} ms`
    })
  }
}
