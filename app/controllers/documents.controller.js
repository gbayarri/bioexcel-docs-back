const db = require("../models");
const common = require("./common.functions.js");
const Document = db.documents;

// Create and Save a new Document or update if exists
exports.create = (req, res) => {
    // Validate request
    if (!req.body.id || !req.body.name || !req.body.abstract || !req.body.path || !req.body.category) {
        res.status(400).send({ message: "Incomplete Document!" });
        return;
    }

    let update = {
        id: req.body.id,
        name: req.body.name,
        abstract: req.body.abstract,
        path: req.body.path,
        category: req.body.category
    };

    Document.findOneAndUpdate({ id: req.body.id }, update, { new: true, upsert: true }, function (error, result) {
        if (!error) {
            // If the document doesn't exist
            if (!result) {
                // Create it
                console.log(`Creating new document ${req.body.id}.`);

                // Create a Document
                const result = new Document({
                    id: req.body.id,
                    name: req.body.name,
                    abstract: req.body.abstract,
                    path: req.body.path,
                    category: req.body.category
                });

            } else {

                console.log(`Updating document ${req.body.id}.`);

            }

            // Save Document in the database
            result
                .save()
                .then(data => {
                    res.send({ id: data.id, name: data.name, abstract: data.abstract });
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Document."
                    });
                });
        }
    });

};

// Delete a Document with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    // check by key
    if (req.body.key != process.env.KEY_DELETE) {
        res.status(400).send({ message: "Incorrect key!" });
        return;
    }

    console.log(`Removing ${id} document.`);

    Document.findOneAndDelete({ id: id })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Document with id=${id}. Maybe Document was not found!`
                });
            } else {
                res.send({
                    message: "Document was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Document with id=" + id
            });
        });
};

// Find a single Document by id
exports.findOne = (req, res) => {
    const id = req.params.id;

    console.log(`Finding ${id} document.`);

    Document.findOne({ id: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Document with id " + id });
            else res.send({ id: data.id, name: data.name, abstract: data.abstract });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Document with id=" + id });
        });
};

// Find Documents by category
exports.findCategory = (req, res) => {
    const category = req.params.category;

    console.log(`Finding all documents for ${category} category.`);

    Document.find({ category: category })
        .then(data => {
            if (!data || !data.length) {
                res.status(404).send({ message: "Not found Document with category " + category });
            } else {
                const newData = data.map(({ id, name, abstract, category }) => ({ id, name, abstract, category }))
                res.send(newData);
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Document with category=" + category });
        });
};

// Retrieve all Documents from the database.
exports.findAll = (req, res) => {
    const id = req.query.id;
    var condition = id ? { id: { $regex: new RegExp(id), $options: "i" } } : {};

    console.log(`Finding all documents.`);

    Document.find(condition)
        .then(data => {
            const newData = data.map(({ id, name, abstract, category }) => ({ id, name, abstract, category }))
            res.send(newData);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving documents."
            });
        });
};

