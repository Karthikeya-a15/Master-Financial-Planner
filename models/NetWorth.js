import mongoose from "mongoose";

const NetWorthSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inflows: {
        postTaxSalary: {
            type: Number,
            required: true
        },
        businessIncome: {
            type: Number,
            required: true
        },
        rentalIncome: {
            type: Number,
            required: true
        },
        otherIncome: {
            type: Number,
            required: true
        }
    },
    outflows: {
        monthlyExpenses: {
            type: Number,
            required: true
        },
        compulsoryInvestments: {
            type: Number,
            required: true
        },
        emis: {
            type: Number,
            required: true
        },
        insurance: {
            type: Number,
            required: true
        },
        others: {
            type: Number,
            required: true
        }
    }
});

const NetWorth = mongoose.model('NetWorth', NetWorthSchema);

export default NetWorth;