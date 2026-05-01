const { execSync } = require("child_process")

// 🔥 LIST MODULE
const modules = [
  "@whiskeysockets/baileys",
  "pino",
  "qrcode-terminal",
  "qrcode",
  "axios",
  "sharp",
  "yt-search"
]

// 🔥 AUTO INSTALL
function installModule(mod) {
  try {
    require.resolve(mod)
    console.log(`✅ ${mod} sudah ada`)
  } catch {
    console.log(`📦 Installing ${mod}...`)
    execSync(`npm install ${mod}`, { stdio: "inherit" })
  }
}

console.log("🚀 Checking modules...\n")

modules.forEach(installModule)

console.log("\n✅ Semua module siap!\n")

// 🔥 JALANKAN BOT
require("./main")
