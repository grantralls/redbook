const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: String,
    name: String,
    password: String,
    isManager: Boolean,
});

let user = mongoose.model('users', userSchema);

module.exports = user;