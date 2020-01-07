const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {type: String, required:true},
    password : {type: String, required: true},
    creationDate: {type: Date, default: Date.now},
    email: {type: String, required: true},
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cart'}],
    rank: {type: String, enum: ['admin','user'], default: 'user'}
});

module.exports = mongoose.model('User', userSchema);
