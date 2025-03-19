import express from "express";
import dotenv from "dotenv";
import userAuth from "../middleware/userAuthMiddleware.js";
import axios from "axios";
dotenv.config();

const router = express.Router();

router.use(userAuth);

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CREDIT_CARDS = [
  {
    name: "HDFC Regalia",
    category: "travel",
    rewards: "4 reward points per ₹150",
    fees: 2500,
  },
  {
    name: "SBI Cashback Card",
    category: "shopping",
    rewards: "5% cashback on online spending",
    fees: 999,
  },
  {
    name: "ICICI Amazon Pay",
    category: "shopping",
    rewards: "5% cashback on Amazon",
    fees: 0,
  },
  {
    name: "Axis Vistara",
    category: "travel",
    rewards: "Airport lounge access & air miles",
    fees: 3000,
  },
  {
    name: "BPCL SBI Card",
    category: "fuel",
    rewards: "4.25% fuel savings",
    fees: 499,
  },
];

// Function to analyze transactions and determine spending category
const analyzeTransactions = (transactions) => {
  const spendingSummary = {};
  transactions.forEach(({ category, amount }) => {
    spendingSummary[category] = (spendingSummary[category] || 0) + amount;
  });
  return spendingSummary;
};

// API Endpoint for Credit Card Recommendation
router.post("/recommend", async (req, res) => {
  try {
    const transactions = req.body.transactions;
    if (!transactions || transactions.length === 0) {
      return res.status(400).json({ error: "Transactions data is required" });
    }

    const spendingSummary = analyzeTransactions(transactions);

    const prompt = `
        Given the user's spending pattern: ${JSON.stringify(spendingSummary)},
        recommend the best credit card from the following options:
        ${JSON.stringify(CREDIT_CARDS)}
        The recommendation should be based on the highest spending category and benefits provided by the card.
        Return only the best matching credit card with an explanation.
        `;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    const rawRecommendation =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No recommendation available";

    // Extract structured details
    const match = rawRecommendation.match(/\*\*Recommendation:\s*(.*?)\*\*/);
    const cardName = match ? match[1] : "Unknown Card";

    const explanationMatch = rawRecommendation.match(
      /\*\*Explanation:\*\*\n\n([\s\S]*)/
    );
    const explanation = explanationMatch
      ? explanationMatch[1]
      : "No detailed explanation available.";

    res.json({
      recommended_card: cardName,
      reason: explanation,
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate recommendation" });
  }
});

export default router;
