import zod from 'zod';

const cashFlowsSchema = zod.object({
    inflows: zod.object({
        postTaxSalary: zod.number().nonnegative().optional(),
        businessIncome: zod.number().nonnegative().optional(),
        rentalIncome: zod.number().nonnegative().optional(),
        otherIncome: zod.number().nonnegative().optional()
    }),
    outflows: zod.object({
        monthlyExpenses: zod.number().nonnegative().optional(),
        compulsoryInvestments: zod.number().nonnegative().optional(), //ulips and chit-funds
        emis: zod.number().nonnegative().optional(),
        insurance: zod.number().nonnegative().optional(),
        others: zod.number().nonnegative().optional()
    })
});

const realEstateSchema = zod.object({
    home: zod.number().nonnegative().optional(),
    otherRealEstate: zod.number().nonnegative().optional(),
    REITs: zod.number().nonnegative().optional()
});

const cryptoSchema = zod.object({
    crypto: zod.number().nonnegative().optional()
});

const goldSchema = zod.object({
    jewellery: zod.number().nonnegative().optional(),
    SGB: zod.number().nonnegative().optional(),
    digitalGoldAndETF: zod.number().nonnegative().optional(),
});

const foreignEquitySchema = zod.object({
    sAndp500: zod.number().nonnegative().optional(),
    otherETF: zod.number().nonnegative().default(0).optional(),
    mutualFunds: zod.number().nonnegative().optional()
});

const directStockSchema = zod.object({
    stockName: zod.string(),
    category: zod.enum(["large cap", "mid cap", "small cap"]),
    currentValue: zod.number().nonnegative()
});

const mutualFundSchema = zod.object({
    fundName: zod.string(),
    category: zod.enum(["large cap", "mid cap", "small cap", "flexi cap", "multi cap"]),
    currentValue: zod.number().nonnegative()
});

const sipEquitySchema = zod.object({
    sipName: zod.string(),
    category: zod.enum(["large cap", "mid cap", "small cap", "flexi cap", "multi cap"]),
    sip: zod.number().nonnegative()
});

const domesticEquitySchema = zod.object({
    directStocks: zod.array(directStockSchema).optional(),
    mutualFunds: zod.array(mutualFundSchema).optional(),
    sipEquity: zod.array(sipEquitySchema).optional()
});

const liquidFundSchema = zod.object({
    
    particulars: zod.string(),
    currentValue: zod.number().nonnegative()
});

const fixedDepositSchema = zod.object({
    
    bankName: zod.string(),
    currentValue: zod.number().nonnegative()
});

const debtFundSchema = zod.object({
    
    name: zod.string(),
    currentValue: zod.number().nonnegative()
});

const governmentInvestmentSchema = zod.object({
    
    name: zod.string(),
    currentValue: zod.number().nonnegative()
});

const sipDebtSchema = zod.object({
    name: zod.string(),
    duration: zod.enum(["FD/RD/Arbitrage", "Banking PSU/Corporate funds", "Government Securities/Equity Saver"]),
    currentValue: zod.number().nonnegative(),
  });
  

const debtSchema = zod.object({
    liquidFund: zod.array(liquidFundSchema).optional(),
    fixedDeposit: zod.array(fixedDepositSchema).optional(),
    debtFunds: zod.array(debtFundSchema).optional(),
    governmentInvestments: zod.array(governmentInvestmentSchema).optional(),
    sipDebt : zod.array(sipDebtSchema).optional()
});

const liabilitiesSchema = zod.object({
    homeLoan: zod.number().nonnegative().optional(),
    educationLoan: zod.number().nonnegative().optional(),
    carLoan: zod.number().nonnegative().optional(),
    personalLoan: zod.number().nonnegative().optional(),
    creditCard: zod.number().nonnegative().optional(),
    other: zod.number().nonnegative().optional()
});

const miscellaneousSchema = zod.object({
    otherInsuranceProducts: zod.number().nonnegative().optional(),
    smallCase: zod.number().nonnegative().optional()
});

export { 
    cashFlowsSchema, 
    realEstateSchema, 
    cryptoSchema, 
    goldSchema, 
    foreignEquitySchema,
    domesticEquitySchema,
    debtSchema,
    liabilitiesSchema,
    miscellaneousSchema
};