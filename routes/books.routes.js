const express = require("express");
const {
  getBooks,
  getBook,
  getBestBooks,
  setBook,
  editBook,
  deleteBook,
  rateBook,
} = require("../controllers/book.controller");
const { tokenChecker } = require("../middlewares/tokenManager");
const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBook);
router.get("/bestrating", getBestBooks);
router.post("/", tokenChecker, setBook);
router.put("/:id", tokenChecker, editBook);
router.delete("/:id", tokenChecker, deleteBook);
router.post("/:id/rating", tokenChecker, rateBook);

module.exports = router;
