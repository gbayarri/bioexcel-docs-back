const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv').config();
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const app = express();
app.use(express.json());

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
//let gfs;
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        //console.log("Connected to the database.");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

db.mongoose.connection.on('connected', () => {
    console.log('Connected to the database. Connecting to GridFS')
    const gfs = new db.mongoose.mongo.GridFSBucket(db.mongoose.connection.db, {
        bucketName: "uploads"
    });

    // REST API base URL
    app.get("/", (req, res) => {
        res.json({ message: "Welcome to bioexcel-docs REST." });
    });

    // **********************
    app.post("/files/del/:id", (req, res) => {
        console.log(req.params.id)
        gfs.delete(new db.mongoose.Types.ObjectId(req.params.id), (err, data) => {
        //gfs.delete({ filename: req.params.id }, (err, data) => {

            console.log(err, data)

            if (err) return res.status(404).json({ err: err.message });
            res.redirect("/");
        });
    });
    // **********************
    /*gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
            if (err) {
                return res.status(404).json({ err });
            }
            return;

        });*/

    // call to routes for documents
    require("./app/routes/documents.routes")(app, gfs, db.mongoose);

    // call to routes for files
    require("./app/routes/files.routes")(app, upload, gfs);

    // set port, listen for requests
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}. If in development mode, open VPN!`);
    });
})

// Storage
const storage = new GridFsStorage({
    url: db.url,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const body = JSON.parse(JSON.stringify(req.body));
                const str_meta = JSON.parse(JSON.stringify(body.metadata));
                const meta = JSON.parse(str_meta);
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    metadata: meta,
                    bucketName: "uploads"
                };

                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});
