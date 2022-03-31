const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const cors = require("cors")
const path = require("path")
const bodyParser = require("body-parser")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })

global.users = []

app.use(bodyParser())
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const rand = () => {
  return Math.random().toString(36).substr(2)
}

const createToken = () => {
  return rand() + rand()
}

app.post("/upload_files", upload.array("files"), (req, res) => {
  let token = createToken()
  let filesData = []
  req.files.map((e, i) => {
    filesData.push(e.buffer.toString("base64"))
  })

  users.push({ token: token, files: req.files, filesData: filesData })
  res.send(token)
})

app.get(`/download_files/:token`, (req, res) => {
  res.sendFile(path.join(__dirname, "./downloadFilesPage/index.html"))
})

app.post(`/download_files/:token`, (req, res) => {
  console.log("54: req.body:", req.body)
  console.log("55: req.params:", req.params)
  let findTokenInUsers = users.filter((e) => e.token === req.params.token)
  const dotan = { name: "dotan -from serverto client" }
  if (findTokenInUsers[0]) {
    console.log("findTokenInUsers found: ", findTokenInUsers[0].token)
    let files = findTokenInUsers[0].files
    let filesData = findTokenInUsers[0].filesData
    res.send({ files, filesData })
  } else {
    console.log("findTokenInUsers empty")
    res.send(alert("User not found. No files."))
  }
})

if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, "./client/build")))
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
  })
}
const PORT = process.env.PORT || 2005

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
