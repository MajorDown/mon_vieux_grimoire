const express = require("express");
const { tokenChecker } = require("../middlewares/tokenManager");
const configMulter = require("../middlewares/configMulter");
const {
  getBooks,
  getBook,
  getBestBooks,
  createBook,
  editBook,
  deleteBook,
  rateBook,
} = require("../controllers/book.controller");
const router = express.Router();

router.get("/", getBooks);
router.get("/bestrating", getBestBooks);
router.get("/:id", getBook);
router.post("/", tokenChecker, configMulter, createBook);
router.put("/:id", tokenChecker, configMulter, editBook);
router.delete("/:id", tokenChecker, deleteBook);
router.post("/:id/rating", tokenChecker, rateBook);

module.exports = router;
