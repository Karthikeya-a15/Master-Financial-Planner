import express from "express";
import CashFlows from "../../models/CashFlows.js";
import RealEstate from "../../models/RealEstate.js";
import Miscellaneous from "../../models/miscellaneous.js";
import Liabilities from "../../models/Liabilities.js";
import Gold from "../../models/Gold.js";
import Goals from "../../models/Goals.js";
import ForeignEquity from "../../models/ForeignEquity.js";
import DomesticEquity from "../../models/DomesticEquity.js";
import Debt from "../../models/Debt.js";
import CryptoCurrency from "../../models/CryptoCurrency.js";
import User from "../../models/User.js";
import RAM from "../../models/returnsAndAssets.js";

const router = express.Router();

export default async function bulkInputController(req, res) {
    try {
        const userId = req.user;
        const {
            cashFlows,
            ramSchema,
            realEstate,
            miscellaneous,
            liabilities,
            gold,
            goalSchema,
            foreignEquity,
            domesticEquity,
            debt,
            cryptoCurrency
        } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Helper function to update or create a document
        const updateDocument = async (Model, id, data) => {
            if (id) {
                return await Model.findByIdAndUpdate(id, { $set: data }, { new: true, upsert: true });
            } else {
                const newDoc = new Model(data);
                await newDoc.save();
                return newDoc;
            }
        };

        // Updating documents (wrapping arrays inside objects)
        const updatedCashFlows = await updateDocument(CashFlows, user.netWorth.cashFlows, cashFlows);
        const updatedReturnsAndAssets = await updateDocument(RAM, user.ram, ramSchema);
        const updatedRealEstate = await updateDocument(RealEstate, user.netWorth.realEstate, realEstate);
        const updatedMiscellaneous = await updateDocument(Miscellaneous, user.netWorth.miscellaneous, miscellaneous);
        const updatedLiabilities = await updateDocument(Liabilities, user.netWorth.liabilities, liabilities);
        const updatedGold = await updateDocument(Gold, user.netWorth.gold, gold);
        const updatedGoals = await updateDocument(Goals, user.goals, { 
            goals: goalSchema.goals, 
            sipAssetAllocation: goalSchema.sipAssetAllocation 
        });
        const updatedForeignEquity = await updateDocument(ForeignEquity, user.netWorth.foreignEquity, foreignEquity);
        const updatedDomesticEquity = await updateDocument(DomesticEquity, user.netWorth.domesticEquity, { ...domesticEquity });
        const updatedDebt = await updateDocument(Debt, user.netWorth.debt, { ...debt });
        const updatedCryptoCurrency = await updateDocument(CryptoCurrency, user.netWorth.cryptocurrency, cryptoCurrency);

        // Updating user's net worth references
        user.netWorth.cashFlows = updatedCashFlows._id;
        user.ram = updatedReturnsAndAssets._id;
        user.netWorth.realEstate = updatedRealEstate._id;
        user.netWorth.miscellaneous = updatedMiscellaneous._id;
        user.netWorth.liabilities = updatedLiabilities._id;
        user.netWorth.gold = updatedGold._id;
        user.goals = updatedGoals._id;
        user.netWorth.foreignEquity = updatedForeignEquity._id;
        user.netWorth.domesticEquity = updatedDomesticEquity._id;
        user.netWorth.debt = updatedDebt._id;
        user.netWorth.cryptocurrency = updatedCryptoCurrency._id;

        await user.save();

        res.status(201).json({
            message: "Net worth data updated successfully",
            data: {
                cashFlows: updatedCashFlows,
                returnsAndAssets: updatedReturnsAndAssets,
                realEstate: updatedRealEstate,
                miscellaneous: updatedMiscellaneous,
                liabilities: updatedLiabilities,
                gold: updatedGold,
                goals: updatedGoals,
                foreignEquity: updatedForeignEquity,
                domesticEquity: updatedDomesticEquity,
                debt: updatedDebt,
                cryptoCurrency: updatedCryptoCurrency
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating net worth data", error: error.message });
    }
}
