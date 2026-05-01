const fs = require("fs")
const path = require("path")
const { owner } = require("./config")

const pluginsPath = path.join(__dirname, "plugins")

let plugins = []

// 🔥 LOAD PLUGINS
const loadPlugins = () => {
  plugins = fs.readdirSync(pluginsPath).map(file => {
    delete require.cache[require.resolve(path.join(pluginsPath, file))]
    return require(path.join(pluginsPath, file))
  })
  console.log("✅ Plugins loaded:", plugins.length)
}

loadPlugins()

// 🔄 AUTO RELOAD
fs.watch(pluginsPath, () => {
  console.log("♻️ Reloading plugins...")
  loadPlugins()
})

module.exports = async (sock, m, { db }) => {
  try {
    if (!m.message) return
    if (m.key.fromMe) return

    const from = m.key.remoteJid
    const sender = m.key.participant || from

    const text =
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      ""

    if (!text) return

    console.log("📩 Pesan:", text)

    // 🔥 PREFIX
    const prefixes = [".", "!", "/"]
    const prefix = prefixes.find(p => text.startsWith(p))

    let command = ""
    let args = []

    if (prefix) {
      args = text.slice(prefix.length).trim().split(/ +/)
      command = args.shift()?.toLowerCase()
    }

    // 🔐 OWNER
    const isOwner = owner.includes(sender)

    // =============================
    // 🔥 LEVEL SYSTEM (AUTO XP)
    // =============================
    if (!db.users[sender]) {
      db.users[sender] = { level: 1, xp: 0 }
    }

    const user = db.users[sender]

    // ❌ jangan hitung XP kalau command
    if (!prefix) {
      user.xp += Math.floor(Math.random() * 10) + 5

      const xpNext = user.level * 100

      if (user.xp >= xpNext) {
        user.level += 1
        user.xp = 0

        await sock.sendMessage(from, {
          text: `🎉 Selamat! Kamu naik ke level ${user.level}`
        })
      }
    }

    // =============================
    // 🔥 JALANKAN PLUGIN
    // =============================
    for (let plugin of plugins) {
      if (!plugin) continue

      try {
        // 🔹 COMMAND PLUGIN
        if (plugin.command && plugin.command.length > 0) {
          if (!prefix) continue

          if (plugin.command.includes(command)) {

            if (plugin.owner && !isOwner) {
              return sock.sendMessage(from, {
                text: "❌ Khusus owner"
              })
            }

            await plugin.execute(sock, m, args, { db })
          }

        } else {
          // 🔥 AUTO PLUGIN (AI AUTO, STICKER DLL)
          await plugin.execute(sock, m, args, { db })
        }

      } catch (err) {
        console.log(`❌ Error di plugin ${plugin.command || "auto"}:`, err)
      }
    }

  } catch (err) {
    console.log("❌ Handler error:", err)
  }
}
