const BookModel = require("../models/book.model");

module.exports.getBooks = async (req, res) => {
  const books = await BookModel.find();
  res.status(200).json(books);
};

module.exports.getBook = async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    res.status(400).json({ message: "aucun livre ne corespond à cet id" });
  }
  res.status(200).json(book);
};

module.exports.setBook = async (req, res) => {
  if (!req.body.message) {
    res.status(400).json({ message: "pas de nouveau livre envoyé" });
  }
  const post = await BookModel.create({
    message: req.body.message,
    author: req.body.author,
  });
  res.status(200).json(post);
};

module.exports.editBook = async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    res.status(400).json({ message: "aucun livre ne corespond à cet id" });
  }
  const updatedBook = await BookModel.findByIdAndUpdate(post, req.body, {
    new: true,
  });
  res.status(200).json({ message: "livre mis à jour : " + updatedBook });
};

module.exports.deleteBook = async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    res.status(400).json({ message: "aucun livre ne corespond à cet id" });
  }
  await book.remove();
  res.status(200).json({ message: "livre supprimé" });
};

module.exports.rateBook = async (req, res) => {
  try {
    await BookModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          ratings: { userId: req.body.userId, grade: req.body.grade },
        },
      },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};
