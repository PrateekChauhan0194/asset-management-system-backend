const mongoose = require('mongoose');
const { Schema } = mongoose;

const borrowerSchema = new Schema({
    serviceNumber: {
        type: String,
        required: true,
        unique: true,
    },
    rank: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    dataCreationDate: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('borrower', borrowerSchema);