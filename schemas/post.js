const { Schema} = require("mongoose")
const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const Post = new Schema({
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
}, {
        timestamps: true
    });


Post.plugin(passportLocalMongoose)

module.exports = mongoose.model("Post", Post)


