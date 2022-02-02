
// Upload new file to GridFS
exports.upload = (req, res) => {
    res.json({ file: req.file })
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
                metadata: { id: req.params.id, type: req.params.type }
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
