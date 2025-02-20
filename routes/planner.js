import express from "express";
import userAuth from "../middleware/userAuthMiddleware.js";
import assumptionController from "../controllers/put/assumptionController.js";
import getFinancialGoalsController from "../controllers/get/getFinancialGoalsController.js";
import financialGoalsController from "../controllers/put/financialGoalsController.js";


const router = express.Router();

router.use(userAuth);

router.get("/financialGoals", getFinancialGoalsController);

router.put("/financialGoals", financialGoalsController);

//RAM INPUT
router.put("/assumptions", assumptionController);

export default router;