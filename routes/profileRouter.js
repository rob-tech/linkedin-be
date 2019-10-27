const express = require('express');
const bodyParser = require('body-parser');
const auth = require("../autheticate/index")
const passport = require("passport")
const Profiles = require("../schemas/profiles");
const Experiences = require("../schemas/experience")
const router = express.Router();

router.use(bodyParser.json());

router.get("/", (req, res, next) => {
    Profiles.find({}).then(app => {
        res.json(app);
    })
})

// router.get("/", async (req, res) => {
//     res.send(await Profiles.find({}))
// })



router.post("/register", async (req, res) => {

    var find = await Profiles.find( {user: req.body})

    if (find.length > 0) {
        res.statusCode = 400;
        res.send("We already have the username" + "'" + req.body.username + "'" + "on our system")
    }
    else {
        req.body.username = req.user;

        try {
            var newProfile = await Profiles.create(req.body);
            newProfile = await Profiles.register(newProfile, req.body.password)
            res.send(newProfile)
            console.log(newProfile)

        }
        catch (err) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err
            });
        }

        var token = auth.getToken({ _id: newProfile._id })

        res.statusCode = 200
        res.json({
            status: "new user created",
            user: req.user,
            token: token,
            success: true,
        })
    }
})

router.put("/:username",
    (req, res, next) => {
        Profiles.findOneAndUpdate(
            { username: req.params.username },
            { $set: req.body },
            { new: true }
        )
            .then(
                app => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(app);
                },

                error => next(error),
            )
            .catch(error => next(error));
    }
)

router.post("/login", passport.authenticate("local"), (req, res) => {
    var token = auth.getToken({ _id: req.user._id })
    res.statusCode = 200
    res.json({
        status: "Login Ok",
        user: req.user,
        token: token,
        success: true,
    })
})

// profileRouter.post("/refresh", auth.verifyUser, (req, res) => {
//     var token = auth.getToken({_id: req.user._id})
//     res.statusCode = 200
//     res.json({
//         status: "Login Ok",
//         user: req.user,
//         token: token,
//         success: true,
//     })
// })

router.get("/me", (req, res) => {
    Profiles.findOne(
        { username: req.user }
    )
        .then(
            app => {
                res.json(app);
            },
            err => next(err)
        )
        .catch(err => next(err));
}
)

router.get("/:userName", (req, res) => {
    Profiles.findOne(
        { username: req.params.userName }
    )
        .then(
            app => {
                res.json(app);
            },
            err => next(err)
        )
        .catch(err => next(err));
})

// profileRouter.route("/:userName/experiences")
//     .get(async (req, res) => {
//         res.json(await Experiences.find({ username: req.params.userName }));
//     })
//     .post(async (req, res) => {
//         req.body.username = req.user.username;
//         var exp = await Experiences.create(req.body)
//         res.json(exp);
//     })

// profileRouter.route("/:userName/experiences/:expId")
//     .get(async (req, res) => {
//         res.json(await Experiences.findById(req.params.expId));
//     })
//     .put(async (req, res) => {
//         var exp = await Experiences.findById(req.params.expId);
//         if (exp.username == req.user) {
//             var updated = await Experiences.findByIdAndUpdate(req.params.expId, req.body)
//             res.json(updated);
//         }
//         else {
//             res.status(401);
//             res.send("Unauthorized")
//         }
//     })
//     .delete(async (req, res) => {
//         var exp = await Experiences.findById(req.params.expId);
//         if (exp.username == req.user) {
//             await Experiences.findByIdAndDelete(req.params.expId)
//             res.send("Deleted");
//         }
//         else {
//             res.status(401);
//             res.send("Unauthorized")
//         }
//     })

module.exports = router;
