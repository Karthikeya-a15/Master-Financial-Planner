import mongoose from "mongoose";
import DomesticEquity from "../../models/DomesticEquity.js";
import User from "../../models/User.js";
import { domesticEquitySchema } from "../../schemas/netWorthSchemas.js";

export default async function domesticEquityController(req, res) {
    const {directStocks, mutualFunds, sipEquity } = req.body;

    let { success, error } = domesticEquitySchema.safeParse({directStocks, mutualFunds, sipEquity });

    if (!success) {
        return res.status(403).json({ message: "Domestic Equity inputs are wrong", err: error.format() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user;

        const { selection } = req.body;

        if(!selection)
                return res.status(403).json({message : "Selection not provided"});

        const user = await User.findOne({ _id: userId });
        // console.log(user);

        const domesticEquityId = user.netWorth.domesticEquity;

        let userDomesticEquity;

        const updateField = {
            directStocks : { directStocks },
            mutualFunds : { mutualFunds },
            sipEquity : { sipEquity }
        }[selection] || { sipEquity }

        userDomesticEquity = await DomesticEquity.findOneAndUpdate(
            {_id : domesticEquityId},
            {
                $set : updateField
            },
            {new : true}
        )

        await session.commitTransaction();
        session.endSession();

        if (userDomesticEquity) {
            return res.status(200).json({ message: "Domestic Equity updated successfully to Networth" });
        } else {
            return res.status(403).json({ message: "Domestic Equity not updated" });
        }

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal error", err: err.message });
    }
};
