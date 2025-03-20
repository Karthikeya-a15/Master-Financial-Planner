import DomesticEquity from "../../models/DomesticEquity.js";
export default async function  adminMutualfundsController(req, res) {
    try {
        const mutualFunds = await DomesticEquity.aggregate([
            {
                $unwind: "$mutualFunds"
            },
            {
                // $match: {
                //     "mutualFunds.category": "mid cap"
                // }
                $group : {
                    _id : "$mutualFunds.category",
                    totalInvestment: { $sum: "$mutualFunds.currentValue" },
                    investorCount: { $sum: 1 }
                }
            },  
            {
                $sort: { totalInvestment: -1 }
            }
        ]);

        return res.json({ mutualFunds });
    } catch(err) {
        return res.status(500).json({message: "Internal error", error: err.message});
    }
}