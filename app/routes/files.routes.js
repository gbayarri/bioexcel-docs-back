module.exports = (app, upload, gfs) => {

  const files = require("../controllers/files.controller.js");

  var router = require("express").Router();

  // Upload file
  router.post("/", upload.single("file"), files.upload);

  // Get file by name
  router.get("/:filename", files.findByName(gfs))

  // Get file by document id and type
  router.get("/:id/:type", files.findByMeta(gfs))

  // define path for this controller
  app.use('/api/files', router);
};