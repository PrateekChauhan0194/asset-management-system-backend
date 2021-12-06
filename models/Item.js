const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    serviceNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    serialNumber: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    gigNumber: {
        type: String,
        required: true,
    },
    issueDate: {
        type: Date,
        required: true,
    },
    dataCreationDate: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('item', itemSchema);