const { Schema} = require("mongoose")
const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

var User = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    }
}, {
    timestamps: true
//    role: {
//        type: String,
//        default: "user"
//    }

})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", User)