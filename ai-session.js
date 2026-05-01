const users = {}

module.exports = {
  setOn: (id) => users[id] = true,
  setOff: (id) => delete users[id],
  isOn: (id) => !!users[id]
}
