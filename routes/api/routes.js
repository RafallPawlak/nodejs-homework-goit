const express = require("express");
const userRouter = require("./users");
const contactRouter = require("./contacts");

const router = express.Router();

router.use("/users", userRouter);
router.use("/contacts", contactRouter);

module.exports = router;