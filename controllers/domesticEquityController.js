import DomesticEquity from "../models/DomesticEquity.js";
import User from "../models/User.js";
import { domesticEquitySchema } from "../schemas/netWorthSchemas.js";

export default async function domesticEquityController(req, res) {
    const body = req.body;

    let { success, error } = domesticEquitySchema.safeParse(body);

    if (!success) {
        return res.status(403).json({ message: "Domestic Equity inputs are wrong", err: error.format() });
    }

    try {
        const userId = req.user;

        const { directStocks, mutualFunds, sipEquity } = body;

        const user = await User.findOne({ _id: userId });

        const domesticEquityId = user.netWorth.domesticEquity;

        const userDomesticEquity = await DomesticEquity.findOneAndUpdate(
            { _id: domesticEquityId },
            {
                $set: {
                    directStocks: directStocks,  
                    mutualFunds: mutualFunds,    
                    sipEquity: sipEquity         
                }
            },
            { new: true }
        );

        if (userDomesticEquity) {
            return res.status(200).json({ message: "Domestic Equity updated successfully to Networth" });
        } else {
            return res.status(403).json({ message: "Domestic Equity not updated" });
        }

    } catch (err) {
        return res.status(500).json({ message: "Internal error", err: err.message });
    }
};
