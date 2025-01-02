const mongoose = require('mongoose');

const saltSchema = new mongoose.Schema({
    user_id: { type: Number, required: true, unique: true }, // Reference to the user
    salt: { type: String, required: true }, // The generated salt
});

const Salt = mongoose.model('Salt', saltSchema);

module.exports = Salt;
