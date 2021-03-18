const express = require('express');
const got = require('got');
const path = require('path');
const cheerio = require('cheerio');
const redis = require('redis');
require('dotenv').config();

//Initialize express and Redis
const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

// Set static files
app.use(express.static(path.join(__dirname, "public")));

// Set views
app.set('views', './views')
app.set('view engine', 'ejs');

app.listen(PORT, () => {console.log("Listening on port " + PORT)})

app.get("/", (req, res) => {
    res.render("./index")
})

app.get("/coin", (req, res) => {
    res.render("coin")
})

// TODO Better error handling and promise rejection on failure
// Scraping Etherscan or BSCScan for holder count
app.get("/holders/:platform/:contract", (req, res) => {
    let endpoint = `https://etherscan.io/token/${req.params.contract}`
    if(req.params.platform == "bsc"){endpoint = `https://bscscan.com/token/${req.params.contract}`}
    got(endpoint)
    .then((html) => {
        const $ = cheerio.load(html.body);
        const holderDiv = $('#ContentPlaceHolder1_tr_tokenHolders');
        if (req.params.platform == "eth"){
            // The div with class mr-3 contains the holder count, percentage change and the change graph. We only care about the holder count. 
            // Trim the HTML (remove whitespace), split to only get what's before the first HTML element, remove all spaces  
            res.status(200).json({holders: ((holderDiv.find('.mr-3')).html().trim().split('<')[0]).replace(" ", "")})
        }
        else(
            res.status(200).json({holders: ((holderDiv.find('.mr-3')).text().trim().replace(" ", "").replace(/[^0-9,]+/, ''))})
        )
    })
    .catch(error=>{
        console.log(error)
    })
})
// TODO Figure out apprioriate error reporting. I'll never look at the console. 
// Using the Etherscan API for total supply supply (CG Max supply is unreliable)
app.get("/totalSupply/:contract", (req, res) => {
    let endpoint = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${req.params.contract}&apikey=${process.env.etherscan}`;
    got.get(endpoint, {responseType: 'json'}).then(response => {
        res.status(200).json({ totalSupply: response.body.result })
    })
    .catch(error => {
        console.log(error);
    });
})

// Getting the list of all coins from CoinGecko
async function getCoinList(req, res, next){
    try{
        console.log("Getting coin list from CoinGecko list")
        const response = await got("https://api.coingecko.com/api/v3/coins/list", {responseType: 'json'})
        res.status(200).json({coinList: response.body}) 

        client.setex('coinList', 3600, JSON.stringify(response.body))
    } catch(err){
        console.error(err);
        res.status(500);
    }
}

app.get("/coinList", isListCached, getCoinList);

//Cache middleware to check if the coin list has been cached 
function isListCached(req, res, next) {
    client.get("coinList", (err, data) => {
        if (err) throw err;
        if (data !== null) {
            res.json({coinList: JSON.parse(data)});
        } else {
            next(); //If the list was not found, get it from CoinGecko
        }
    });
}