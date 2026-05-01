import { execSync } from "child_process"
import fs from "fs"

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

// 🔥 AUTO INSTALL (opsional, tapi aman)
function installModule(mod) {
  try {
    await import(mod)
    console.log(`✅ ${mod} sudah ada`)
  } catch {
    console.log(`📦 Installing ${mod}...`)
    execSync(`npm install ${mod}`, { stdio: "inherit" })
  }
}

console.log("🚀 Checking modules...\n")

for (const mod of modules) {
  try {
    await import(mod)
    console.log(`✅ ${mod} sudah ada`)
  } catch {
    console.log(`📦 Installing ${mod}...`)
    execSync(`npm install ${mod}`, { stdio: "inherit" })
  }
}

console.log("\n✅ Semua module siap!\n")

// 🔥 JALANKAN BOT
import "./main.js"
