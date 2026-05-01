const fs = require("fs")
const file = "./database/users.json"

function loadDB() {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ users: {} }, null, 2))
  }
  return JSON.parse(fs.readFileSync(file))
}

function saveDB(db) {
  fs.writeFileSync(file, JSON.stringify(db, null, 2))
}

function addUser(db, id) {
  if (!db.users[id]) {
    db.users[id] = { xp: 0, level: 1, limit: 10 }
  }
}

module.exports = { loadDB, saveDB, addUser }