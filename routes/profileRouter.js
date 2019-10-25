const express = require('express');
const bodyParser = require('body-parser');
const profileRouter = express.Router();
const auth = require("../autheticate/index")
const passport = require("passport")

profileRouter.use(bodyParser.json());

var Profiles = require("../schemas/profiles");
var Experiences = require("../schemas/experience")


profileRouter.route('/')
    .get((req, res, next) => {
        Profiles.find({}).then(app => {
            res.json(app);
        })
    })
    .post("/register", async (req, res, next) => {
        var find = await Profiles.find({ username: req.user })
        console.log(find);
        if (find.length > 0) {
            res.statusCode = 400;
            res.send("User " + req.user + " already exists")
        }
        else {
      
            req.body.username = req.user;
            var newProfile = await Profiles.create(req.body);
            try {     
                newProfile = await Profiles.register(newProfile, req.body.password)
                res.send(newProfile)
              
            }
            catch (err) {
                res.status(err.status || 500);
                res.json({
                    message: err.message,
                    error: err
                });
            }
         
             var token = auth.getToken({_id: newUser._id})
             res.statusCode = 200
             res.json({
                 status: "new user created",
                 user: req.user,
                 token: token,
                 success: true,
             })            
        }
    })

    .put(
        (req, res, next) => {
            Profiles.findOneAndUpdate(
                { username: req.user },
                { $set: req.body },
                { new: true }
            )
                .then(
                    app => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(app);
                    },
                    err => next(err)
                )
                .catch(err => next(err));
        }
    )

    profileRouter.post("/login", passport.authenticate("local"), (req, res) => {
        var token = auth.getToken({_id: req.user._id})
        res.statusCode = 200
        res.json({
            status: "Login Ok",
            user: req.user,
            token: token,
            success: true,
        })
    })

    profileRouter.post("/refresh", auth.verifyUser, (req, res) => {
        var token = auth.getToken({_id: req.user._id})
        res.statusCode = 200
        res.json({
            status: "Login Ok",
            user: req.user,
            token: token,
            success: true,
        })
    })

profileRouter.get("/me", (req, res) => {
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

profileRouter.get("/:userName", (req, res) => {
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

profileRouter.route("/:userName/experiences")
    .get(async (req, res) => {
        res.json(await Experiences.find({ username: req.params.userName }));
    })
    .post(async (req, res) => {
        req.body.username = req.user.username;
        var exp = await Experiences.create(req.body)
        res.json(exp);
    })

profileRouter.route("/:userName/experiences/:expId")
    .get(async (req, res) => {
        res.json(await Experiences.findById(req.params.expId));
    })
    .put(async (req, res) => {
        var exp = await Experiences.findById(req.params.expId);
        if (exp.username == req.user) {
            var updated = await Experiences.findByIdAndUpdate(req.params.expId, req.body)
            res.json(updated);
        }
        else {
            res.status(401);
            res.send("Unauthorized")
        }
    })
    .delete(async (req, res) => {
        var exp = await Experiences.findById(req.params.expId);
        if (exp.username == req.user) {
            await Experiences.findByIdAndDelete(req.params.expId)
            res.send("Deleted");
        }
        else {
            res.status(401);
            res.send("Unauthorized")
        }
    })


module.exports = profileRouter;