import axios from 'axios';

var allFunds = null;

const fetchFunds = async () => {
    const response = await axios.post("https://api.tickertape.in/mf-screener/query",{
        "match":{"option":["Growth"],"subsector":["Flexi Cap Fund","Large Cap Fund","Small Cap Fund","Mid Cap Fund","Multi Cap Fund"]},"sortBy":"aum","sortOrder":-1,"project":["subsector","option","navClose"],"offset":0,"count":500,"mfIds":[]
    })

    const funds = response.data.data.result;



    allFunds = funds.map((item) => {
        const subsectorObj = item.values.find(v => v.filter === "subsector");
        let categoryVal = subsectorObj ? subsectorObj.strVal : null;
        if(categoryVal === "Flexi Cap Fund" || categoryVal === "Multi Cap Fund"){
            categoryVal = "Flexi/Multi Cap Fund";
        }
        const navObj = item.values.find(v => v.filter === "navClose");

        let fundName = item.name;
        if(item.name.indexOf("Plan") !== -1){
            fundName = item.name.substring(0, item.name.indexOf("Plan"));
        }
        return {
            name: fundName,
            category: categoryVal,
            nav : navObj ? navObj.doubleVal : null
        };
    });
}


export default async function autoSuggestionMFController(req, res){
    const { name, category } = req.query;

    if(!allFunds){
        await fetchFunds();
    
        // Set up a daily update
        setInterval(async () => {
            await fetchFunds();
        }, 1000 * 60 * 60 * 24);
    }

    const categoryFunds = allFunds.filter(fund => fund.category.toLowerCase() === category.toLowerCase()+" fund");

    const filteredFunds = categoryFunds.filter(fund => fund.name.toLowerCase().includes(name.toLowerCase()));


    return res.json(filteredFunds);
}