import express from 'express';

import userAuth from '../middleware/userAuthMiddleware.js';

import cashFlowsController from '../controllers/put/cashFlowsController.js';
import realEstatesController from '../controllers/put/realEstateController.js';
import cryptoController from '../controllers/put/cryptoController.js';
import domesticEquityController from '../controllers/put/domesticEquityController.js';
import debtController from '../controllers/put/debtController.js';
import foreignEquityController from '../controllers/put/foreignEquityController.js';
import goldController from '../controllers/put/goldController.js';
import liabilitiesController from '../controllers/put/liabilitiesController.js';
import miscellaneousController from '../controllers/put/miscellaneousController.js';


import getCashFlowsController from '../controllers/get/getCashFlowsController.js';
import getRealEstateController from '../controllers/get/getRealEstateController.js';
import getDomesticEquityController from '../controllers/get/getDomesticEquityController.js';
import getDebtController from '../controllers/get/getDebtController.js';
import getLiabilitiesController from '../controllers/get/getLiabilitiesController.js';
import getForeignEquityController from '../controllers/get/getForeignEquityController.js';
import getGoldController from '../controllers/get/getGoldController.js';
import getCryptoController from '../controllers/get/getCryptoController.js';
import getMiscellaneousController from '../controllers/get/getMiscellaneousController.js';
import getDashBoardController from '../controllers/get/getDashBoardController.js';


import bulkInputController from "../controllers/post/bulkInputController.js";

const router = express.Router();

router.use(userAuth);

//USER GET Routes 
router.get("/dashboard", getDashBoardController);

router.get('/cashFlows', getCashFlowsController);

router.get("/realEstate", getRealEstateController);

router.get("/domesticEquity", getDomesticEquityController);

router.get("/debt", getDebtController);

router.get("/liabilities",getLiabilitiesController);

router.get("/foreignEquity", getForeignEquityController);

router.get("/gold", getGoldController);

router.get("/cryptoCurrency", getCryptoController);

router.get("/miscellaneous",getMiscellaneousController);

router.post("/bulk", bulkInputController);

//USER PUT INPUTS

router.put('/cashFlows', cashFlowsController);

router.put("/realEstate", realEstatesController);

router.put("/domesticEquity", domesticEquityController);

router.put("/debt", debtController);

router.put("/liabilities",liabilitiesController);

router.put("/foreignEquity", foreignEquityController);

router.put("/gold", goldController);

router.put("/cryptoCurrency", cryptoController);

router.put("/miscellaneous",miscellaneousController);

export default router;