const fs = require("fs")
const path = require("path")

const mediaPath = path.join(__dirname, "../media")

const getMedia = (fileName) => {
  const file = path.join(mediaPath, fileName)

  if (!fs.existsSync(file)) {
    console.log("❌ File tidak ditemukan:", fileName)
    return null
  }

  return fs.readFileSync(file)
}

module.exports = { getMedia }
