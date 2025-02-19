import mongoose from "mongoose";

const miscellaneousSchema = new mongoose.Schema({
    otherInsuranceProducts : {
        type : Number,
        default: 0
    },
    smallCase : {
        type : Number,
        default: 0
    }
});


const miscellaneous = mongoose.model('Miscellaneous', miscellaneousSchema);

export default miscellaneous;