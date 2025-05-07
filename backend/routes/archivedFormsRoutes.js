const express = require("express");
const router = express.Router();
const ArchivedFormsController = require("../Controllers/archivedFormsController");

router.get("/templates/:templateId", ArchivedFormsController.getByTemplateId);

module.exports = router;
