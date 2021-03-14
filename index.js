const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'html');

app.get("/", (req, res) => {
    res.render("./index.html")
})

// app.get("/coin/:name", (req, res) => {
//     // var queryParameter = req.query;
//     res.render("./coin")
//     // res.send("Getting stats for "+req.params.name)
// })

app.listen(port, () => {console.log("Listening on port " + port)})