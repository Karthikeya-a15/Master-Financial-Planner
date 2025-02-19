import express from "express";

function fireCalculator(req, res) {
    const { monthlyExpenses, age, retirementAge, inflation, coastAge } = req.body;

    const annualExpenses = monthlyExpenses * 12;
    const yearsToRetirement = retirementAge - age;
    const yearlyExpensesRetirement = annualExpenses * Math.pow((1 + inflation / 100), yearsToRetirement);

    // console.log(yearlyExpensesRetirement);
    const leanFireNumber = yearlyExpensesRetirement * 15;
    const fireNumber = yearlyExpensesRetirement * 25;
    const fatFireNumber = yearlyExpensesRetirement * 50;

    const expectedRateOfReturn = 10;
    const coastFireNumber = fireNumber / (Math.pow((1 + expectedRateOfReturn / 100), retirementAge - coastAge));

    res.json({
        yearlyExpensesRetirement: yearlyExpensesRetirement,
        leanFireNumber: leanFireNumber,
        fireNumber: fireNumber,
        fatFireNumber: fatFireNumber,
        coastFireNumber: coastFireNumber
    });
}

// fireCalculator({body : {monthlyExpenses: 50000, age: 25, retirementAge: 40, inflation: 6, coastAge : 25}}, {json: console.log});

function sipCalculator(req, res) {
    const { monthlyInvestment, years, rateOfReturn } = req.body;
    const months = years * 12;
    const monthlyRateOfReturn = rateOfReturn / 12;
    const investedAmount = monthlyInvestment * months;
    const futureValue = monthlyInvestment * ((Math.pow((1 + monthlyRateOfReturn / 100), months) - 1) / (monthlyRateOfReturn / 100)) * (1 + monthlyRateOfReturn / 100);
    const estimatedReturns = futureValue - investedAmount;
    res.json({
        investedAmount: investedAmount,
        estimatedReturns: estimatedReturns,
        futureValue: futureValue
    });
}

// sipCalculator({body : {monthlyInvestment: 10000, years: 7, rateOfReturn: 12}}, {json: console.log});

function stepSipCalculator(req, res) {
    const { monthlyInvestment, years, rateOfReturn, incrementRate } = req.body;

    const P = monthlyInvestment;
    const s = incrementRate / 100;
    const r = rateOfReturn / 100;
    const n = years;
    const totalMonths = years * 12;
    const stepUpFrequency = 12;
    let totalInvestment = (12 * monthlyInvestment * (Math.pow((1 + s), years) - 1)) / s;

    let monthlyRate = r / 12;
    let futureValue = 0;
    let currentPrincipal = P;
    for (let month = 0; month < totalMonths; month++) {
        if (month > 0 && month % stepUpFrequency === 0) {
            currentPrincipal *= (1 + s);
        }
        let monthsRemaining = totalMonths - month;
        futureValue += currentPrincipal * Math.pow(1 + monthlyRate, monthsRemaining);
    }

    res.json({
        totalInvestment: totalInvestment,
        futureValue: futureValue,
        estimatedReturns: futureValue - totalInvestment
    });

}

// stepSipCalculator({ body: { monthlyInvestment: 10000, years: 7, rateOfReturn: 12, incrementRate: 5 } }, { json: console.log });

function fdCalculator(req, res) {
    const { principal, years, rateOfInterest } = req.body;
    const rate = rateOfInterest / 100;
    const futureValueYearly = principal * Math.pow((1 + rate), years);
    const interestYearly = futureValueYearly - principal;

    const futureValueHalfYearly = principal * Math.pow((1 + rate / 2), 2 * years);
    const interestHalfYearly = futureValueHalfYearly - principal;

    const futureValueQuarterly = principal * Math.pow((1 + rate /4),4*years);
    const interestQuarterly = futureValueQuarterly - principal;
    
    const futureValueMonthly = principal * Math.pow((1 + rate /12),12*years);
    const interestMonthly = futureValueMonthly - principal;
    res.json({
        futureValueYearly: futureValueYearly,
        interestYearly: interestYearly,
        futureValueHalfYearly: futureValueHalfYearly,
        interestHalfYearly: interestHalfYearly,
        futureValueQuarterly: futureValueQuarterly,
        interestQuarterly: interestQuarterly,
        futureValueMonthly: futureValueMonthly,
        interestMonthly: interestMonthly
    });
}

// fdCalculator({ body: { principal: 500000, years: 5, rateOfInterest: 5 } }, { json: console.log });


function rdCalculator(req, res) {
    const { monthlyDeposit, years, rateOfInterest } = req.body;
    const rate = rateOfInterest / 100;
    const totalMonths = years * 12;
    let futureValue = 0;
    let totalDeposit = 0;
    for (let month = 0; month < totalMonths; month++) {
        totalDeposit += monthlyDeposit;
        futureValue += monthlyDeposit * Math.pow((1 + rate / 12), totalMonths - month);
    }
    const interest = futureValue - totalDeposit;
    res.json({
        totalDeposit: totalDeposit,
        futureValue: futureValue,
        interest: interest
    });
}

// rdCalculator({body : {monthlyDeposit: 15000, years: 10, rateOfInterest: 5}}, {json: console.log});

function cagrCaluculator(req, res){
    const {initialValue, finalValue, years} = req.body;
    const cagr = Math.pow(finalValue/initialValue, 1/years) - 1;
    res.json({
        cagr: cagr*100
    });
}

// cagrCaluculator({body : {initialValue: 10000, finalValue: 12000, years: 4}}, {json: console.log});

function lumpsumCalculator(req, res){
    const {lumpsumAmount, years, rateOfReturn} = req.body;
    const futureValue = lumpsumAmount * Math.pow((1 + rateOfReturn/100), years);
    const interest = futureValue - lumpsumAmount;

    res.json({
        futureValue: futureValue,
        interest: interest
    });
}

// lumpsumCalculator({body : {lumpsumAmount: 5000, years: 4, rateOfReturn: 12}},{json: console.log});