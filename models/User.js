import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    netWorth : {
        cashFlows : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CashFlows',
            },
            domesticEquity : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'DomesticEquity',
            },
            debt : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Debt',
            },
            realEstate : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'RealEstate',
            },
            foreignEquity : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ForeignEquity',
            },
            cryptocurrency : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CryptoCurrency',
            },
            gold : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Gold',
            },
            liabilities : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Liabilities',
            },
            miscellaneous : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Miscellaneous',
            }
    },
    goals : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goals',
    },
    ram : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'returnsAndAssets',
    }
});

userSchema.methods.hashPassword = async function(){
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
    return await bcrypt.hash(this.password, SALT_ROUNDS);
}

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;