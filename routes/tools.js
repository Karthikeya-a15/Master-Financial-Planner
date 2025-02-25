import express from "express";

import userAuth from "../middleware/userAuthMiddleware.js";

import getToolsController from  "../controllers/get/getIndexFundsController.js";
import indexFundsController from "../controllers/put/indexFundsController.js";
import mutualFundsConroller from "../controllers/put/mutualFundsController.js";
import debtFundsController from "../controllers/put/debtFundsController.js";

const router = express.Router();

router.use(userAuth);

router.get("/indexfunds",getToolsController);

router.post("/indexfunds",indexFundsController);

router.post("/mutualfunds",mutualFundsConroller);

router.post("/debtfunds",debtFundsController);


export default router;