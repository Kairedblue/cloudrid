const router = require("express").Router();

router.use("/v1/auth", require("./v1/auth.routes"));
router.use("/v2/auth", require("./v2/auth.routes.js"));

module.exports = router;