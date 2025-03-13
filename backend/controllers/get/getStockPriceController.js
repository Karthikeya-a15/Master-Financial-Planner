import { getStockPriceByName } from "../../utils/nse.js";


export default async function getStockPriceController(req, res) {
    const { name } = req.query;

    const price = await getStockPriceByName(name.toLowerCase()) || 0;

    return res.json({price});
}