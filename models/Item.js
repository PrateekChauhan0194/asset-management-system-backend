const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    serviceNumber: {
        type: String,
        required: true,
        unique: true,
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
    dateOfIssue: {
        type: Date,
        required: true,
    },
    dataCreationDate: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('item', itemSchema);