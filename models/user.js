const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');

const UserSchema = new Schema({
    name: {
        type: string,
        require:true
    },
    email: {
        type: string,
        require:true
    },
    password: {
        type: string,
        require:true
    },
    avatar: {
        type: string
    },
    date: {
        type:date,
        default: Date.now
    },
})

const User = mongoose.model('user',UserSchema);

module.exports = User;