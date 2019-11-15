const express = require("express")
const cors = require("cors")
const auth = require("./autheticate/index")
const userRouter = require("./routes/userRouter")
const loginRouter = require("./routes/loginRouter")
const postRouter = require("./routes/postRouter")
const mongoose = require("mongoose")
const passport = require("passport")

const http = require("http");
const socketio = require("socket.io");

require('dotenv').config()

const app = express()
app.use(cors())
const port = process.env.PORT || 3000;
app.set("port", port)
const server = http.createServer(app).listen(app.get("port"));


const io = socketio(server);

io.set('transports', ["websocket"])

io.on("connection", socket => {
  console.log("New Connection");

})


app.use(express.json());
app.use(passport.initialize())

app.use("/users", auth.verifyUser, userRouter)
app.use("/login", loginRouter)
app.use("/feeds",  auth.verifyUser, postRouter)

app.get("/authenticate", auth.verifyUser, auth.adminOnly, (req, res) => {
  res.send(req.user)
})

mongoose.connect(process.env.Connect, {
  useNewUrlParser: true
}).then( () => {
  console.log("Server running on port 3000");
}).catch(err => console.log(err))

// server.listen(3000, () => {
//   console.log("Server running on port 3000")
// })
