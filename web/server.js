const express = require("express")
const app = express()

app.get("/", (req, res) => {
  res.send("EllBot-MD Online 🚀")
})

app.listen(3000, () => console.log("Web running"))