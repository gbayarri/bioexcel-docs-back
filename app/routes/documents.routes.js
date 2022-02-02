module.exports = app => {
    const documents = require("../controllers/documents.controller.js");

    var router = require("express").Router();

    // Create a new Document or upodate if exists
    router.post("/", documents.create);

    // Delete a Document by id
    router.delete("/:id", documents.delete);

    // Retrieve a single Document by id
    router.get("/:id", documents.findOne);

    // Retrieve a Document by category
    router.get("/category/:category", documents.findCategory);

    // Retrieve all Documents
    router.get("/", documents.findAll);

    // define path for this controller
    app.use('/api/documents', router);
};