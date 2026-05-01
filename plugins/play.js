import yts from 'yt-search'
import ytdl from 'ytdl-core'
import axios from 'axios'
import fetch from 'node-fetch'

const LimitAud = 725 * 1024 * 1024
const LimitVid = 425 * 1024 * 1024

let tempStorage = {}

const handler = async (m, { conn, text, command }) => {
  try {
    // 🔍 kalau user kirim judul
    if (text && !['🎶', 'audio', '📽', 'video'].includes(text)) {
      const search = await yts(text)
      if (!search.videos.length) {
        return conn.reply(m.chat, '❌ Lagu tidak ditemukan', m)
      }

      const video = search.videos[0]

      tempStorage[m.sender] = {
        url: video.url,
        title: video.title
      }

      const caption = `
⌘━━━〔 YOUTUBE PLAY 〕━━━⌘
🎵 ${video.title}
⏱ ${video.timestamp}
👀 ${video.views}
📅 ${video.ago}
👤 ${video.author.name}
🔗 ${video.url}
⌘━━━━━━━━━━━━━━━━━━━⌘`.trim()

      return conn.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption,
        footer: 'Pilih format',
        buttons: [
          { buttonId: 'audio', buttonText: { displayText: '🎶 Audio' }, type: 1 },
          { buttonId: 'video', buttonText: { displayText: '📽 Video' }, type: 1 }
        ],
        headerType: 4
      }, { quoted: m })
    }

    // ❗ ambil data tersimpan
    const userVideoData = tempStorage[m.sender]
    if (!userVideoData) {
      return conn.reply(m.chat, '❌ Tidak ada data video', m)
    }

    // 🔊 AUDIO
    if (text === '🎶' || text === 'audio') {
      await conn.reply(m.chat, '⏳ Download audio...', m)

      let url = await getAudio(userVideoData.url)

      if (!url) return conn.reply(m.chat, '❌ Gagal ambil audio', m)

      const size = await getFileSize(url)

      if (size > LimitAud) {
        await conn.sendMessage(m.chat, {
          document: { url },
          mimetype: 'audio/mpeg',
          fileName: `${userVideoData.title}.mp3`
        }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, {
          audio: { url },
          mimetype: 'audio/mpeg'
        }, { quoted: m })
      }
    }

    // 🎥 VIDEO
    if (text === '📽' || text === 'video') {
      await conn.reply(m.chat, '⏳ Download video...', m)

      let url = await getVideo(userVideoData.url)

      if (!url) return conn.reply(m.chat, '❌ Gagal ambil video', m)

      const size = await getFileSize(url)

      if (size > LimitVid) {
        await conn.sendMessage(m.chat, {
          document: { url },
          mimetype: 'video/mp4',
          fileName: `${userVideoData.title}.mp4`
        }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, {
          video: { url },
          caption: userVideoData.title
        }, { quoted: m })
      }
    }

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Terjadi error', m)
  } finally {
    delete tempStorage[m.sender]
  }
}

handler.command = /^(play)$/i
export default handler

// ================= FUNCTION =================

// 🔊 ambil audio (API + fallback ytdl)
async function getAudio(url) {
  try {
    // API 1
    let res = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${url}`)
    let json = await res.json()
    if (json?.dl) return json.dl
  } catch {}

  try {
    // fallback ytdl
    let info = await ytdl.getInfo(url)
    let format = info.formats.find(f =>
      f.mimeType?.includes('audio') && f.contentLength
    )
    return format?.url
  } catch {}

  return null
}

// 🎥 ambil video (API + fallback ytdl)
async function getVideo(url) {
  try {
    let res = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${url}`)
    let json = await res.json()
    if (json?.dl) return json.dl
  } catch {}

  try {
    let info = await ytdl.getInfo(url)
    let format = info.formats.find(f =>
      f.container === 'mp4' &&
      f.hasVideo &&
      f.hasAudio &&
      f.contentLength
    )
    return format?.url
  } catch {}

  return null
}

// 📦 size file
async function getFileSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return parseInt(res.headers.get('content-length')) || 0
  } catch {
    return 0
  }
}
