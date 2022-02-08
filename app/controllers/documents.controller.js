const db = require("../models");
const Document = db.documents;

// Create and Save a new Document or update if exists
exports.create = (req, res) => {
    // Validate request
    if (!req.body.id || !req.body.name || !req.body.abstract || !req.body.category) {
        res.status(400).send({ message: "Incomplete Document!" });
        return;
    }

    let update = {
        id: req.body.id,
        name: req.body.name,
        abstract: req.body.abstract,
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
exports.delete = (gfs, mongoose) => {
    return function (req, res, next) {
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

                    // once document removed, remove associated files (pdf + png) as well
                    gfs
                        .find({
                            'metadata.id': req.params.id, 'metadata.type': { $regex: new RegExp(/^(pdf|png)$/) }
                        })
                        .toArray((err, files) => {

                            if (!files || files.length === 0) {
                                return res.status(404).json({
                                    err: "No related files found"
                                });
                            }

                            const idsArray = files.map(a => a._id);
                            // it seems that gfs hasn't deleteMany method, so remove files one by one
                            idsArray.forEach(item => {
                                gfs.delete(new mongoose.Types.ObjectId(item), (err, data) => {
                                    if (err) return res.status(404).json({ err: err.message });
                                })
                            });

                            res.send({
                                message: "Document and related files were deleted successfully!"
                            });

                        })

                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Could not delete Document with id=" + id
                });
            });
    }
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

// Update a Document by the id in the request
exports.update = (req, res) => {
    if (Object.keys(req.body).length === 0 || !req.body.id) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Document.findOneAndUpdate({ id: req.body.id }, req.body, { new: true, upsert: true })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Document with id=${id}. Maybe Document was not found!`
                });
            } else res.send({ message: "Document was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Document with id=" + id
            });
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

