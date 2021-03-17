const express = require('express');
const request = require('request');
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

app.get("/totalSupply/:contract", (req, res) => {
    request(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${req.params.contract}&apikey=${process.env.etherscan}`, { json: true }, (err, response, body) => {
        if (err) { return console.log(err); }
        res.status(200).json({ totalSupply: body.result })
    })
})

// app.get("/coin/:name", (req, res) => {
//     // var queryParameter = req.query;
//     res.render("./coin")
//     // res.send("Getting stats for "+req.params.name)
// })

app.listen(port, () => {console.log("Listening on port " + port)})