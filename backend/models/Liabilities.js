import mongoose from "mongoose";

const liabilitiesSchema = new mongoose.Schema({
    homeLoan : {
        type : Number,
        default: 0
    },
    educationLoan : {
        type : Number,
        default: 0
    },
    carLoan : {
        type : Number,
        default: 0
    },
    personalLoan : {
        type : Number,
        default: 0
    },
    creditCard : {
        type : Number,
        default: 0
    },
    other : {
        type : Number,
        default: 0
    }
});

const liabilities = mongoose.model('Liabilities', liabilitiesSchema);

export default liabilities;