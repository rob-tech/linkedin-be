const express = require("express")
const cors = require("cors")
const auth = require("./autheticate/index")
var userRouter = require("./routes/userRouter")
var postRouter = require("./routes/postRouter")
var profileRouter = require("./routes/profileRouter")
const mongoose = require("mongoose")
const passport = require("passport")

require('dotenv').config()

const server = express()

server.use(cors())
server.use(express.json());
server.use(passport.initialize())

server.use("/users", userRouter)
server.use("/posts", postRouter)
server.use("/profile", profileRouter)

server.get("/authenticate", auth.verifyUser, auth.adminOnly, (req, res) => {
  res.send(req.user)
})

mongoose.connect("mongodb+srv://diegostriveschool:h6nxg5U9SDcsLA26@cluster0-3ar0p.azure.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true
}).then(server.listen(3000, () => {
  console.log("Server running on port 3000");
})).catch(err => console.log(err))

// server.listen(3000, () => {
//   console.log("Server running on port 3000")
// })
