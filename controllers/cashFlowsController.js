import mongoose from "mongoose";
import CashFlows from "../models/CashFlows.js";
import User from "../models/User.js";
import { cashFlowsSchema } from "../schemas/netWorthSchemas.js";

export default async function cashFlowsController(req, res) {
    const body = req.body;

    let { success, error } = cashFlowsSchema.safeParse(body);

    if (!success) {
        return res.status(403).json({ message: "Cash-Flow inputs are wrong", err: error.format() });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user;
        const { inflows, outflows } = body;

        const user = await User.findOne({_id : userId });

        const cashFlowId = user.netWorth.cashFlows;

        const existingCashFlow = await CashFlows.findOne({ _id: cashFlowId });

        const userCashFlows = await CashFlows.findOneAndUpdate(
            { _id: cashFlowId },
            {
                $set: {
                    "inflows": { ...existingCashFlow.inflows, ...inflows },
                    "outflows": { ...existingCashFlow.outflows, ...outflows }
                }
            },
            { new: true }
        );
        
        await session.commitTransaction();
        session.endSession();

        if (userCashFlows) {
            return res.status(200).json({ message: "Cash-Flows Updated successfully" });
        } else {
            return res.status(403).json({ message: "Cash-Flows not updated" });
        }

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal error", err: err.message });
    }

}