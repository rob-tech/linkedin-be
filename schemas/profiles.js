const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const Profiles = new Schema({
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
});



Profiles.plugin(passportLocalMongoose)

module.exports = mongoose.model("Profiles", Profiles);


// User.plugin(passportLocalMongoose)

// module.exports = mongoose.model("User", User)