import mongoose from "mongoose";


const CryptoCurrencySchema = new mongoose.Schema({
    crypto : {
        type : Number,
        default: 0
    }
});

const CryptoCurrency = mongoose.model('CryptoCurrency', CryptoCurrencySchema);

export default CryptoCurrency;