const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username require"],
        unique: true
    },

    email: {
        type: String,
        required: [true, "email require"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "username require"],
    }
})

const usermodel = mongoose.model("user", userSchema);

module.exports = usermodel;