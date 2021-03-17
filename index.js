const express = require('express');
const got = require('got');
const path = require('path');
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

// Using the Etherscan API for holder count and max supply (CG Max supply is unreliable)
app.get("/holders/:contract", (req, res) => {
    
})

// div id="ContentPlaceHolder1_tr_tokenHolders"
// div class="mr-3"

app.get("/totalSupply/:contract", (req, res) => {
    let endpoint = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${req.params.contract}&apikey=${process.env.etherscan}`;
    got.get(endpoint, {responseType: 'json'}).then(response => {
        res.status(200).json({ totalSupply: response.body.result })
    })
    .catch(error => {
        console.log(error.response.body);
    });
})

// app.get("/coin/:name", (req, res) => {
//     // var queryParameter = req.query;
//     res.render("./coin")
//     // res.send("Getting stats for "+req.params.name)
// })

app.listen(port, () => {console.log("Listening on port " + port)})