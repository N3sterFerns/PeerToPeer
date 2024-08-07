const express = require("express")
const path = require("path")
const indexRouter = require("./routes/indexRouter")


const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))


app.use("/", indexRouter)


app.listen(3000, ()=> console.log("Listening..."))






