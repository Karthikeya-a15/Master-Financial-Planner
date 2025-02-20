import zod from "zod";


const goal = zod.object({
    goalName : zod.string(),
    priority : zod.number().positive().optional(),
    timePeriod : zod.number().positive(),
    amountRequired : zod.number().positive(),
    amountAvailable : zod.number().nonnegative(),
    goalInflation : zod.number().nonnegative(),
    stepUp : zod.number().nonnegative(),
    sipAmount : zod.number().positive(),
    sipAssetAllocation : zod.object({
        domesticEquity : zod.number().nonnegative(),
        usEquity : zod.number().nonnegative(),
        debt : zod.number().nonnegative(),
        gold : zod.number().nonnegative(),
        crypto : zod.number().nonnegative(),
        realEstate : zod.number().nonnegative()
    })
})

const goalSchema = zod.object({
    goals : zod.array(goal).optional()
})

export default goalSchema;