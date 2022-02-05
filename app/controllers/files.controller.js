
// Upload new file to GridFS
exports.upload = (gfs, mongoose) => {
    return function (req, res, next) {

        const body = JSON.parse(JSON.stringify(req.body));
        const str_meta = JSON.parse(JSON.stringify(body.metadata));
        const meta = JSON.parse(str_meta);

        // once document uploaded, check if existed before and remove old one(s)
        gfs
            .find({
                'metadata.id': meta.id, 'metadata.type': meta.type
            })
            .toArray((err, files) => {

                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: "No file(s) found"
                    });
                }

                if (files.length === 1) {
                    return res.send({
                        message: "Document successfully uploaded!",
                        file: req.file
                    });
                }

                const sortedFiles = files.sort((a, b) => b.uploadDate - a.uploadDate)
                sortedFiles.shift()

                const idsArray = sortedFiles.map(a => a._id);
                // it seems that gfs hasn't deleteMany method, so remove files one by one
                idsArray.forEach(item => {
                    gfs.delete(new mongoose.Types.ObjectId(item), (err, data) => {
                        if (err) return res.status(404).json({ err: err.message });
                    })
                });

                res.send({
                    message: "Document successfully updated!",
                    file: req.file
                });

            })
    }

};

// Get file by name
exports.findByName = (gfs) => {
    return function (req, res, next) {
        const file = gfs
            .find({
                filename: req.params.filename
            })
            .toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: "no files exist"
                    });
                }
                gfs.openDownloadStreamByName(req.params.filename).pipe(res);
            });
    }
};

// Get file by document id and type
exports.findByMeta = (gfs) => {
    return function (req, res, next) {
        const file = gfs
            .find({
                //metadata: { id: req.params.id, type: req.params.type }
                'metadata.id': req.params.id, 'metadata.type': req.params.type
            })
            .toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: "no files exist"
                    });
                }
                gfs.openDownloadStreamByName(files[0].filename).pipe(res);
            });
    }
};

// Delete file by id
exports.delete = (gfs, mongoose) => {
    return function (req, res, next) {

        const id = req.params.id;

        // check by key
        if (req.body.key != process.env.KEY_DELETE) {
            res.status(400).send({ message: "Incorrect key!" });
            return;
        }

        console.log(`Removing ${id} document.`);

        gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
            if (err) return res.status(404).json({ err: err.message });
            res.send({
                message: "Document deleted successfully!"
            });
        });
    }
};
