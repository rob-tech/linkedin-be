const express = require("express");
const User = require("../schemas/user")
const auth = require("../autheticate/index")
const passport = require("passport")
const multer = require('multer')
const MulterAzureStorage = require('multer-azure-storage')

require('dotenv').config()

var upload = multer({
    storage: new MulterAzureStorage({
        azureStorageConnectionString: process.env.azureStorageConnectionString,
        containerName: 'images',
        containerSecurity: 'blob'
    })
})


const router = express.Router();

router.get("/", async (req, res) => {
    res.send(await User.find({}))
})

router.post("/register", async (req, res) => {
    // delete req.body.role
    var newUser = new User(req.body)
    try {
        newUser = await User.register(newUser, req.body.password)
    }
    catch (err) {
        res.statusCode = 500
        res.send(err)
    }
    var token = auth.getToken({ _id: newUser._id })
    res.statusCode = 200
    res.json({
        status: "new user created",
        user: req.user,
        token: token,
        success: true,
    })

})


router.get("/:username", (req, res) => {
    User.findOne(
        { username: req.params.username }
    )
        .then(
            app => {
                res.json(app);
            },
            err => next(err)
        )
        .catch(err => next(err));
})

router.post("/refresh", (req, res) => {
    var token = auth.getToken({ _id: req.user._id })
    res.statusCode = 200
    res.json({
        status: "New Token Generated",
        user: req.user,
        token: token,
        success: true,
    })

})

router.post("/:userId/upload", upload.single("img"), async (req, res) => {
    var user = await User.findById(req.params.userId)
    if (user) {
        User.findByIdAndUpdate(req.params.userId, {
            image: req.file.url
        })
        res.send(user)
    } else {
        res.send("user not found")
    }

})



module.exports = router