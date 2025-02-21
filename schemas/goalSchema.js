import zod from "zod";


const goal = zod.object({
    goalName : zod.string(),
    priority : zod.number().positive().optional(),
    time : zod.number().positive(),
    amountRequiredToday : zod.number().positive(),
    amountAvailableToday : zod.number().nonnegative(),
    goalInflation : zod.number().nonnegative(),
    stepUp : zod.number().nonnegative(),
    sipRequired : zod.number().nonnegative(),
    
})

const goalSchema = zod.object({
    goals : zod.array(goal).optional(),
    sipAssetAllocation : zod.object({
        domesticEquity : zod.number().nonnegative(),
        usEquity : zod.number().nonnegative(),
        debt : zod.number().nonnegative(),
        gold : zod.number().nonnegative(),
        crypto : zod.number().nonnegative(),
        realEstate : zod.number().nonnegative()
    }).optional()
})

export default goalSchema;