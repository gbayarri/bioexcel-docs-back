module.exports = (app, upload, gfs, mongoose) => {

    const files = require("../controllers/files.controller.js");

    var router = require("express").Router();

    // Upload file
    router.post("/", upload.single("file"), files.upload(gfs, mongoose));

    // Get file by name
    router.get("/:filename", files.findByName(gfs))

    // Get file by document id and type
    router.get("/:id/:type", files.findByMeta(gfs))

    // Delete file by id
    router.delete("/:id", files.delete(gfs, mongoose))

    // define path for this controller
    app.use('/api/files', router);
};