const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let bugSchema = new Schema({
    date: Date("<YYYY-mm-dd>"),
    type: String,
    location: String,
    manager: String
});

let bug = mongoose.model('bug', bugSchema);

module.exports = bug;