import zod from "zod";

const commonSchema = zod.object({
    domesticEquity : zod.number().nonnegative(),
    usEquity : zod.number().nonnegative(),
    debt : zod.number().nonnegative(),
    gold : zod.number().nonnegative(),
    crypto : zod.number().nonnegative(),
    realEstate : zod.number().nonnegative()
});

const ramSchema = zod.object({
    expectedReturns : commonSchema,
    shortTerm : commonSchema,
    mediumTerm : commonSchema,
    longTerm : commonSchema,
    effectiveReturns : zod.object({
        shortTermReturns : zod.number().nonnegative(),
        mediumTermReturns : zod.number().nonnegative(),
        longTermReturns : zod.number().nonnegative()
    })
});

export default ramSchema;