const express = require('express');
const path = require('path');

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

// app.get("/coin/:name", (req, res) => {
//     // var queryParameter = req.query;
//     res.render("./coin")
//     // res.send("Getting stats for "+req.params.name)
// })

app.listen(port, () => {console.log("Listening on port " + port)})