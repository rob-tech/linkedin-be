const express = require("express");
// const User = require("../schemas/user")
const auth = require("../autheticate/index")
const passport = require("passport")

const router = express.Router();



router.post("/", passport.authenticate("local"), (req, res) => {
    var token = auth.getToken({ _id: req.user._id })
    res.statusCode = 200
    res.json({
        status: "Login Ok",
        user: req.user,
        token: token,
        success: true,
    })
})

module.exports = router