const express = require("express");
const { tokenChecker } = require("../middlewares/tokenManager");
const {
  imageUploader,
  imageResizer,
} = require("../middlewares/sharpAndMulter");
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
router.post("/", tokenChecker, imageUploader, imageResizer, createBook);
router.put("/:id", tokenChecker, imageUploader, imageResizer, editBook);
router.delete("/:id", tokenChecker, deleteBook);
router.post("/:id/rating", tokenChecker, rateBook);

module.exports = router;
