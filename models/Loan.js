import mongoose from 'mongoose';
const { Schema } = mongoose;

const loanSchema = new Schema({
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
    itemName: {
        type: String,
        required: true,
    },
    itemSerialNumber: {
        type: String,
        required: true,
    },
    itemModel: {
        type: String,
        required: true,
    },
    dateOfIssue: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('Loan', loanSchema);