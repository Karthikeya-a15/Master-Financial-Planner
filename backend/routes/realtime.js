import { Router } from "express";
import autoSuggestionMFController from "../controllers/get/autoSuggestionMFController.js";
import autoSuggestionStockController from "../controllers/get/autoSuggestionStockController.js";
import getStockPriceController from "../controllers/get/getStockPriceController.js";
import axios from "axios";
import xml2js from "xml2js";

const router = Router();

router.get("/autoSuggestionMF", autoSuggestionMFController);

router.get("/autoSuggestionStocks", autoSuggestionStockController)

router.get("/stockPrice", getStockPriceController);

var allNews = [];

router.get("/allNews", async(req, res)=>{
    try{
        const rssUrl = "https://news.google.com/rss/search?q=indian%20stock%20market";
        const response = await axios.get(rssUrl, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Failed to parse XML" , err : err.message});
            }

            if (!result?.rss?.channel?.item) {
                return res.status(500).json({ error: "Invalid RSS structure" });
            }

            allNews = result.rss.channel.item.map(item => ({
                title: item.title,
                link: item.link,
                pubDate: new Date(item.pubDate), 
                source: item.source ? item.source._ : "Unknown",
            })).sort((a, b) => b.pubDate - a.pubDate);

            return res.json({})
        });

    }catch (error) {
        res.status(500).json({ error: "Failed to fetch news", details: error.message });
    }
})

router.get("/news", async (req, res) => {
    try {
        
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let startIndex = (page - 1) * limit;
        let endIndex = startIndex + limit;

        const paginatedNews = allNews.slice(startIndex, endIndex);
        const totalPages = Math.ceil(allNews.length / limit)

        res.json({
            currentPage: page,
            totalPages,
            totalResults: allNews.length,
            resultsPerPage: limit,
            news: paginatedNews,
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch news", details: error.message });
    }
});

export default router;
