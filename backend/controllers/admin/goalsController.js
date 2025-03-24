import Goals from "../../models/Goals.js";
export default async function goaslController(req, res) {
    try{
        const calculateOverallAverages = (goalsAggregation) => {
            if (goalsAggregation.length === 0) return null;
        
            let totalAvgSip = 0, totalShortTerm = 0, totalMediumTerm = 0, totalLongTerm = 0;
            let count = goalsAggregation.length;
        
            goalsAggregation.forEach(goal => {
                totalAvgSip += goal.avgSipRequired;
                totalShortTerm += goal.shortTermAvgSip;
                totalMediumTerm += goal.mediumTermAvgSip;
                totalLongTerm += goal.longTermAvgSip;
            });
        
            return {
                avgSipRequired: totalAvgSip / count,
                shortTermAvgSip: totalShortTerm / count,
                mediumTermAvgSip: totalMediumTerm / count,
                longTermAvgSip: totalLongTerm / count
            };
        };
        
        
        const goalCounts = await Goals.aggregate([
            { $unwind: "$goals" }, 
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $lt: ["$goals.time", 3] },
                            then: "shortTerm",
                            else: {
                                $cond: {
                                    if: { $lt: ["$goals.time", 7] },
                                    then: "mediumTerm",
                                    else: "longTerm"
                                }
                            }
                        }
                    },
                    count: { $sum: 1 } 
                }
            }
        ]);
        const formattedCounts = {
            shortTerm: 0,
            mediumTerm: 0,
            longTerm: 0
        };
        goalCounts.forEach(item => {
            formattedCounts[item._id] = item.count;
        });
        // console.log(formattedCounts);
        const goalsAggregation = await Goals.aggregate([
            {
              $unwind: "$goals"
            },
            {
              $group: {
                _id: "$_id",
                avgSipRequired: { $avg: "$goals.sipRequired" },
                shortTermAvgSip: {
                  $avg: {
                    $cond: [{ $lt: ["$goals.time", 3] }, "$goals.sipRequired", null]
                  }
                },
                mediumTermAvgSip: {
                  $avg: {
                    $cond: [
                      { $and: [{ $gte: ["$goals.time", 3] }, { $lt: ["$goals.time", 7] }] },
                      "$goals.sipRequired",
                      null
                    ]
                  }
                },
                longTermAvgSip: {
                  $avg: {
                    $cond: [{ $gte: ["$goals.time", 7] }, "$goals.sipRequired", null]
                  }
                }
              }
            },
            {
              $project: {
                _id: 1,
                avgSipRequired: { $ifNull: ["$avgSipRequired", 0] },
                shortTermAvgSip: { $ifNull: ["$shortTermAvgSip", 0] },
                mediumTermAvgSip: { $ifNull: ["$mediumTermAvgSip", 0] },
                longTermAvgSip: { $ifNull: ["$longTermAvgSip", 0] }
              }
            }
          ]);
        const averagesPerTerm = calculateOverallAverages(goalsAggregation);
        // console.log(averagesPerTerm)          
        return res.status(200).json({formattedCounts, averagesPerTerm});
        
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error : error.message});
    }
}

