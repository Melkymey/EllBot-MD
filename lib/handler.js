const fs = require("fs")
const path = require("path")
const { loadDB, saveDB, addUser } = require("./database")
const { showMenu } = require("./punglin")

const plugins = []

fs.readdirSync("./plugins").forEach(file => {
  plugins.push(require("../plugins/" + file))
})

async function handler(sock, msg, config) {
  const db = loadDB()

  const from = msg.key.remoteJid
  const sender = msg.key.participant || from

  addUser(db, sender)

  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    ""

  if (!text) return

  if (config.autoRead) sock.readMessages([msg.key])

  // XP
  db.users[sender].xp += 5
  if (db.users[sender].xp >= db.users[sender].level * 100) {
    db.users[sender].level++
    await sock.sendMessage(from, {
      text: `🎉 Level ${db.users[sender].level}`
    })
  }

  // anti link
  if (text.includes("chat.whatsapp.com")) {
    return sock.sendMessage(from, { text: "🚫 Link terdeteksi!" })
  }

  saveDB(db)

  if (text === ".menu") {
    return showMenu(sock, from, config, plugins)
  }

  if (!text.startsWith(config.prefix)) return

  const args = text.slice(1).split(/ +/)
  const cmd = args.shift().toLowerCase()

  const plugin = plugins.find(p => p.command.includes(cmd))
  if (plugin) {
    await plugin.execute(sock, msg, args, { config, db })
  }
}

module.exports = { handler }