const controller = require('../Controllers/requestController');
const router = require("express").Router();

router.post("/request", controller.generateAuthUrl);

module.exports = router;
