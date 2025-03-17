import express from "express";

const calculateCompoundInterest = (principal, rate, years, timesCompounded = 1) => {
    let yearlyData = [];
    let currentInvestment = principal;

    for (let year = 1; year <= years; year++) {
        let interest = currentInvestment * (rate / timesCompounded);
        currentInvestment += interest;
        yearlyData.push({
            year: year,
            interestEarned: interest.toFixed(2),
            totalInvestment: currentInvestment.toFixed(2)
        });
    }

    return yearlyData;
};

function fireCalculator(req, res) {
    const { monthlyExpenses, age, retirementAge, inflation, coastAge } = req.body;

    const annualExpenses = monthlyExpenses * 12;
    const yearsToRetirement = retirementAge - age;
    const yearlyExpensesRetirement = annualExpenses * Math.pow((1 + inflation / 100), yearsToRetirement);

    // console.log(yearlyExpensesRetirement);
    // const yearlyData = calculateCompoundInterest(annualExpenses, inflation/100, yearsToRetirement);
    // console.log(yearlyData);
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
    function yearlyCalculation(years){
        const months = years * 12;
        const monthlyRateOfReturn = rateOfReturn / 12;
        const investedAmount = monthlyInvestment * months;
        const futureValue = monthlyInvestment * ((Math.pow((1 + monthlyRateOfReturn / 100), months) - 1) / (monthlyRateOfReturn / 100)) * (1 + monthlyRateOfReturn / 100);
        const estimatedReturns = futureValue - investedAmount;
        return {
            investedAmount: investedAmount,
            estimatedReturns: estimatedReturns,
            futureValue: futureValue
        }
    }
    const sips = [];
    for(let year = 1;year <= years; year++){
        sips.push(yearlyCalculation(year));
    }
    return res.json(sips);
}

// sipCalculator({body : {monthlyInvestment: 10000, years: 7, rateOfReturn: 12}}, {json: console.log});

function stepSipCalculator(req, res) {
    const { monthlyInvestment, years, rateOfReturn, incrementRate } = req.body;

    function yearlyCalculation(year){
        const P = monthlyInvestment;
        const s = incrementRate / 100;
        const r = rateOfReturn / 100;
        const n = year;
        const totalMonths = years * 12;
        const stepUpFrequency = 12;
        let totalInvestment = (12 * monthlyInvestment * (Math.pow((1 + s), year) - 1)) / s;

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
        return {
            totalInvestment: totalInvestment,
            futureValue: futureValue,
            estimatedReturns: futureValue - totalInvestment
        }
    }
    const sips = [];
    for(let year = 1;year <= years; year++){
        sips.push(yearlyCalculation(year));
    }
    res.json(sips);

}

// stepSipCalculator({ body: { monthlyInvestment: 10000, years: 7, rateOfReturn: 12, incrementRate: 5 } }, { json: console.log });

function fdCalculator(req, res) {
    const { principal, years, rateOfInterest } = req.body;
    function yearlyCalculation(year){
        const rate = rateOfInterest / 100;
        const futureValueYearly = principal * Math.pow((1 + rate), year);
        const interestYearly = futureValueYearly - principal;

        const futureValueHalfYearly = principal * Math.pow((1 + rate / 2), 2 * year);
        const interestHalfYearly = futureValueHalfYearly - principal;

        const futureValueQuarterly = principal * Math.pow((1 + rate /4),4*year);
        const interestQuarterly = futureValueQuarterly - principal;
        
        const futureValueMonthly = principal * Math.pow((1 + rate /12),12*year);
        const interestMonthly = futureValueMonthly - principal;
        return {
            futureValueYearly: futureValueYearly,
            interestYearly: interestYearly,
            futureValueHalfYearly: futureValueHalfYearly,
            interestHalfYearly: interestHalfYearly,
            futureValueQuarterly: futureValueQuarterly,
            interestQuarterly: interestQuarterly,
            futureValueMonthly: futureValueMonthly,
            interestMonthly: interestMonthly
        };
    }
    const rds = [];
    for(let year = 1; year <= years; year++){
        rds.push(yearlyCalculation(year));
    }
    res.json(rds);
}

// fdCalculator({ body: { principal: 500000, years: 5, rateOfInterest: 5 } }, { json: console.log });


function rdCalculator(req, res) {
    const { monthlyDeposit, years, rateOfInterest } = req.body;

    function yearlyCalculation(year){
        const rate = rateOfInterest / 100;
        const totalMonths = year * 12;
        let futureValue = 0;
        let totalDeposit = 0;
        for (let month = 0; month < totalMonths; month++) {
            totalDeposit += monthlyDeposit;
            futureValue += monthlyDeposit * Math.pow((1 + rate / 12), totalMonths - month);
        }
        const interest = futureValue - totalDeposit;
        return {
            totalDeposit: totalDeposit,
            futureValue: futureValue,
            interest: interest
        }
    }
    const rds = [];
    for(let year = 1;year <= years; year++){
        rds.push(yearlyCalculation(year));
    }
    return res.json(rds);
}

// rdCalculator({body : {monthlyDeposit: 15000, years: 5, rateOfInterest: 5}}, {json: console.log});

function cagrCaluculator(req, res){
    const {initialValue, finalValue, years} = req.body;
    const cagr = Math.pow(finalValue/initialValue, 1/years) - 1;

    const amounts = calculateCompoundInterest(initialValue, cagr, years);
    return res.json(amounts);
}

// cagrCaluculator({body : {initialValue: 10000, finalValue: 12000, years: 4}}, {json: console.log});

function lumpsumCalculator(req, res){
    const {lumpsumAmount, years, rateOfReturn} = req.body;
    
    let yearlyReport = [];
    let currentInvestment = lumpsumAmount;

    for (let year = 1; year <= years; year++) {
        let futureValue = currentInvestment * (1 + rateOfReturn / 100);
        let interest = futureValue - currentInvestment;

        yearlyReport.push({
            year: year,
            interestEarned: interest.toFixed(2),
            totalInvestment: futureValue.toFixed(2)
        });

        currentInvestment = futureValue;
    }

    res.json({ yearlyReport });
}

// lumpsumCalculator({body : {lumpsumAmount: 5000, years: 4, rateOfReturn: 12}},{json: console.log});