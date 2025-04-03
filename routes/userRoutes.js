const express = require("express");
const userController = require(path.join(
  __dirname,
  "../controllers/userController"
));

const router = express.Router();

router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

module.exports = router;
