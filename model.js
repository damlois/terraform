const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: (true, 'Name is required please input name')
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: (true, 'email is required'),
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default : 'active',
        required: false
    },
    admin:{
        type : Boolean,
        default : false
    }
});

module.exports = mongoose.model('user', UserSchema);