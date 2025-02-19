import zod from "zod";

const goalSchema = zod.object({
    expectedReturns : zod.object({
        domesticEquity : zod.number().nonnegative(),
        usEquity : zod.number().nonnegative(),
        debt : zod.number().nonnegative(),
        gold : zod.number().nonnegative(),
        crypto : zod.number().nonnegative(),
        realEstate : zod.number().nonnegative()
    }),
    shortTerm : zod.object({
        domesticEquity : zod.number().nonnegative(),
        usEquity : zod.number().nonnegative(),
        debt : zod.number().nonnegative(),
        gold : zod.number().nonnegative(),
        crypto : zod.number().nonnegative(),
        realEstate : zod.number().nonnegative()
    }),
    mediumTerm : zod.object({
        domesticEquity : zod.number().nonnegative(),
        usEquity : zod.number().nonnegative(),
        debt : zod.number().nonnegative(),
        gold : zod.number().nonnegative(),
        crypto : zod.number().nonnegative(),
        realEstate : zod.number().nonnegative()
    }),
    longTerm : zod.object({
        domesticEquity : zod.number().nonnegative(),
        usEquity : zod.number().nonnegative(),
        debt : zod.number().nonnegative(),
        gold : zod.number().nonnegative(),
        crypto : zod.number().nonnegative(),
        realEstate : zod.number().nonnegative()
    })
});

export default goalSchema;