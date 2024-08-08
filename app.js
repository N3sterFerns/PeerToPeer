const express = require("express")
const path = require("path")
const indexRouter = require("./routes/indexRouter")
const {Server} = require("socket.io")
const http = require("http")
const {chatVideoController} = require("./controllers/chatVideoController")


const app = express()

const server = http.createServer(app)
const io = new Server(server)

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)

chatVideoController(io)


server.listen(3000, ()=> console.log("Listening..."))






