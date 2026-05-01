async function showMenu(sock, from, config, plugins) {
  let teks = `╭─「 ${config.botName} 」\n`
  teks += `│ Owner: ${config.ownerName}\n`
  teks += `╰────────\n\n`

  plugins.forEach(p => {
    teks += `• ${config.prefix}${p.command[0]} - ${p.desc}\n`
  })

  await sock.sendMessage(from, { text: teks })
}

module.exports = { showMenu }