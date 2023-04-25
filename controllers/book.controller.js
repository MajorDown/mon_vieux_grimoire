const BookModel = require("../models/book.model");

module.exports.getBooks = async (req, res) => {
  try {
    const books = await BookModel.find();
    if (!books) {
      res.status(400).json({ message: "Problême d'acquisition de la DB" });
    }
    if (books.length === 0) {
      res
        .status(204)
        .json({ message: "la DB ne possède pour l'instant aucun livres" });
    }
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des livres",
      err: err,
    });
  }
};

module.exports.getBook = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "aucun livre ne correspond à cet id" });
    } else {
      res.status(200).json(book);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération du livre",
      err: err,
    });
  }
};

module.exports.getBestBooks = async (req, res) => {
  try {
    const bestBooks = await BookModel.find()
      .sort({ averageRating: -1 })
      .limit(3);
    console.log(bestBooks);
    res.status(200).json(bestBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération du livre",
      err: err,
    });
  }
};

module.exports.setBook = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "votre requète ne contient aucun live" });
    }
    const book = await BookModel.create({
      userId: req.body.userId,
      title: req.body.title,
      author: req.body.author,
      imageUrl: req.body.imageUrl,
      year: req.body.year,
      genre: req.body.genre,
    });
    res.status(201).json("nouveau livre enregistré : " + book);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création du livre",
      err: err,
    });
  }
};

module.exports.editBook = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      res.status(400).json({ message: "aucun livre ne corespond à cet id" });
    }
    const updatedBook = await BookModel.findByIdAndUpdate(book, req.body, {
      new: true,
    });
    res.status(200).json({ message: "livre mis à jour : " + updatedBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la modification du livre",
      err: err,
    });
  }
};

module.exports.deleteBook = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      res.status(400).json({ message: "aucun livre ne corespond à cet id" });
    }
    await book.deleteOne();
    res.status(200).json({ message: "livre supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la suppression du livre",
      err: err,
    });
  }
};

module.exports.rateBook = async (req, res) => {
  try {
    const book = await BookModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          //si le userID a déja noté, la note ne sera pas ajouté
          ratings: {
            $cond: {
              if: { $in: [req.body.userId, "$ratings.userId"] },
              then: "$ratings",
              else: { userId: req.body.userId, grade: req.body.grade },
            },
          },
        },
      },
      { new: true }
    );
    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la notation du livre",
      err: err,
    });
  }
};
