const express = require("express");
const {
  getBooks,
  getBook,
  setBook,
  editBook,
  deleteBook,
  rateBook,
} = require("../controllers/book.controller");
const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", setBook);
router.put("/:id", editBook);
router.delete("/:id", deleteBook);
router.post("/:id/rating", rateBook);

module.exports = router;
