const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

ProfileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Profile', ProfileSchema);