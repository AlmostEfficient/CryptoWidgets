const express = require('express');
const got = require('got');
const path = require('path');
const cheerio = require('cheerio');
require('dotenv').config();

//Initialize express
const app = express();
const port = process.env.PORT || 3000;

// Set static files
app.use(express.static(path.join(__dirname, "public")));

// Set views
app.set('views', './views')
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("./index")
})

app.get("/coin", (req, res) => {
    res.render("coin")
})

// TODO Better error handling and promise rejection on failure
// Scraping Etherscan for holder count
app.get("/holders/:contract", (req, res) => {
    got(`https://etherscan.io/token/${req.params.contract}`)
    .then((html) => {
        const $ = cheerio.load(html.body);
        const holderDiv = $('#ContentPlaceHolder1_tr_tokenHolders');
        // The div with class mr-3 contains the holder count, percentage change and the change graph. We only care about the holder count. 
        // Trim the HTML (remove whitespace), split to only get what's before the first HTML element, remove all spaces  
        res.status(200).json({holders: ((holderDiv.find('.mr-3')).html().trim().split('<')[0]).replace(" ", "")})
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

app.listen(port, () => {console.log("Listening on port " + port)})