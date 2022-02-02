module.exports = (app, gfs, mongoose) => {

    const documents = require("../controllers/documents.controller.js");

    var router = require("express").Router();

    // Create a new Document or update if exists
    router.post("/", documents.create);

    // Delete a Document by id
    router.delete("/:id", documents.delete(gfs, mongoose));

    // Retrieve a single Document by id
    router.get("/:id", documents.findOne);

    // Update a Document by id
    router.put("/:id", documents.update);

    // Retrieve a Document by category
    router.get("/category/:category", documents.findCategory);

    // Retrieve all Documents
    router.get("/", documents.findAll);

    // define path for this controller
    app.use('/api/documents', router);
};