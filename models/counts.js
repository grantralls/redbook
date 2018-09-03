const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let countSchema = new Schema({
    countType: String,
    day: [{ month: Number, day: Number }],
    pennies: [{ rolls: Number, moneyAmount: Number }],
    nickles: [{ rolls: Number, moneyAmount: Number }],
    dimes: [{ rolls: Number, moneyAmount: Number }],
    quarters: [{ rolls: Number, moneyAmount: Number }],
    ones: [{ moneyAmount: Number }],
    fives: [{ moneyAmount: Number }],
    safeTotal: Number,
    cashierTills: { type: Number, default: 625 },
    changeDrawer: { type: Number, default: 399 },
    otherChangeFund: Number,
    drawerCount: Boolean,
    manager: String
});

let count = mongoose.model('counts', countSchema);

module.exports = count;