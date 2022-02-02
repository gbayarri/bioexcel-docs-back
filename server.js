const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv').config();

const app = express();

// define allowed origin (?)
var corsOptions = {
    origin: process.env.ORIGIN
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// connect to DB
const db = require("./app/models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

// REST API base URL
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bioexcel-docs REST." });
});

// call to routes for tutorial
//require("./app/routes/tutorial.routes")(app);

// call to routes for documents
require("./app/routes/documents.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. If in development mode, open VPN!`);
});
