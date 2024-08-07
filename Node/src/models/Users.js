const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    address: String,
    phoneNumber: String,
    dogName: String,
    dogBreed: String,
    dogAge: String,
    dogGender: String,
    dogHealthIssues: String,
    dogDietRestrictions: String
}, {
    collection: 'users'
});

const Users = model('users', userSchema);
module.exports = Users;