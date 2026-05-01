module.exports = {
  command: ["level"],
  desc: "Cek level & XP kamu",

  execute: async (sock, msg, args, { db }) => {
    const from = msg.key.remoteJid
    const sender = msg.key.participant || from

    // 🔥 bikin user kalau belum ada
    if (!db.users[sender]) {
      db.users[sender] = {
        level: 1,
        xp: 0
      }
    }

    const user = db.users[sender]

    // 🔥 rumus XP naik level
    const xpNext = user.level * 100

    // 🔥 progress bar
    const progress = Math.floor((user.xp / xpNext) * 10)
    const bar = "█".repeat(progress) + "░".repeat(10 - progress)

    // 🔥 rank simple
    let rank = "Pemula 🐣"
    if (user.level >= 5) rank = "Aktif ⚡"
    if (user.level >= 10) rank = "Pro 🔥"
    if (user.level >= 20) rank = "Master 👑"

    const teks = `
╭━━━〔 *LEVEL KAMU* 〕━━━⬣
│ 👤 User: @${sender.split("@")[0]}
│ 🎖️ Rank: ${rank}
│ ✨ Level: ${user.level}
│ ⚡ XP: ${user.xp}/${xpNext}
│ 📊 Progress:
│ ${bar}
╰━━━━━━━━━━━━━━━━⬣
`

    await sock.sendMessage(from, {
      text: teks,
      mentions: [sender]
    })
  }
}
