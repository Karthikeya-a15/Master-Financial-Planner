import mongoose from "mongoose";

const DebtSchema = new mongoose.Schema({
    name: { type: String,  },
    riskClassification: { type: String,  },
    aum: { type: Number,  },
    cagr: { type: Number,  },
    expenseRatio: { type: Number,  },
    avgYTM: { type: Number,  },
    volatility: { type: Number,  },
    managerTenure: { type: Number,  },
    modifiedDuration: { type: Number,  },
    expectedReturns: { type: Number,  },
    weightedScore: { type: Number,  },
    rank: { type: Number,  }
});

const ArbitrageSchema = new mongoose.Schema({
    name : {type: String},
    AUM : {type : Number},
    cagr : {type : Number},
    inception_date : {type : Date},
    exitLoad : {type : Number},
    expenseRatio : {type : Number},
    OneYearAvgRollingReturns : {type : Number},
    weightedScore : {type : Number},
    rank : {type : Number}
})

const IndexFundSchema = new mongoose.Schema({
    name: { type: String },
    aum: { type: Number },
    expRatio: { type: Number },
    trackErr: { type: Number },
    weightedScore: { type: Number },
    rank: { type: Number }
});

const EquityFundSchema = new mongoose.Schema({
    name: { type: String },
    AUM: { type: Number },
    FiveYearCAGR: { type: Number },
    SortinoRatio: { type: Number },
    expenseRatio: { type: Number },
    FiveYearAvgRollingReturns: { type: Number },
    GreaterThan15Probability: { type: Number },
    weightedScore: { type: Number },
    rank: { type: Number }
});

const EquitySaverFundsSchema = new mongoose.Schema({
    
});

const toolResultsSchema = new mongoose.Schema({
    indexFunds : {
        nifty50: { type: IndexFundSchema, default: {} },
        niftyNext50: { type: IndexFundSchema, default: {} }
    },
    debtFunds : {
        BankingAndPSU: { type : [DebtSchema], default : []},
        CorporateBonds: { type : [DebtSchema], default : []}
    },
    arbitrageFunds : { type : [ArbitrageSchema], default : [] },
    equitySaverFunds : {

    },
    mutualFunds : {
        LargeCapFund : { type : [EquityFundSchema], default : []},
        MultiCapFund: { type: [EquityFundSchema], default: [] },
        FlexiCapFund: { type: [EquityFundSchema], default: [] },
        MidCapFund: { type: [EquityFundSchema], default: [] },
        SmallCapFund: { type: [EquityFundSchema], default: [] }
    }
})