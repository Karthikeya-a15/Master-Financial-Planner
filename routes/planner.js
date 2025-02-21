import express from "express";
import userAuth from "../middleware/userAuthMiddleware.js";
import assumptionController from "../controllers/put/assumptionController.js";
import getFinancialGoalsController from "../controllers/get/getFinancialGoalsController.js";
import financialGoalsController from "../controllers/put/financialGoalsController.js";
import getAssumptionController from "../controllers/get/getAssumptionController.js";

const router = express.Router();

router.use(userAuth);

router.get("/financialGoals", getFinancialGoalsController);

router.get("/assumptions", getAssumptionController);


//RAM INPUT
router.put("/assumptions", assumptionController);

router.put("/financialGoals", financialGoalsController);


export default router;