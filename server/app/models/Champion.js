const mongoose = require('mongoose');

const Champion = new mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Champion', Champion);
