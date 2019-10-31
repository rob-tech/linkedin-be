const express = require("express")
const cors = require("cors")
// var userRouter = require("./routes/userRouter")
const auth = require("./autheticate/index")
const userRouter = require("./routes/userRouter")
const loginRouter = require("./routes/loginRouter")
const postRouter = require("./routes/postRouter")
const mongoose = require("mongoose")
const passport = require("passport")

require('dotenv').config()

const server = express()

server.use(cors())
server.use(express.json());
server.use(passport.initialize())

// server.use("/users", userRouter)
// server.use("/posts", postRouter)
server.use("/users", auth.verifyUser, userRouter)
server.use("/login", loginRouter)
server.use("/feeds", auth.verifyUser, postRouter)

server.get("/authenticate", auth.verifyUser, auth.adminOnly, (req, res) => {
  res.send(req.user)
})

mongoose.connect(process.env.Connect, {
  useNewUrlParser: true
}).then(server.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
})).catch(err => console.log(err))

// server.listen(3000, () => {
//   console.log("Server running on port 3000")
// })
