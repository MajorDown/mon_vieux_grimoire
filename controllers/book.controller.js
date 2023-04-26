const { imageEraser } = require("../middlewares/imageEraser");
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
    } else res.status(200).json(books);
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
    res.status(200).json(bestBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération du livre",
      err: err,
    });
  }
};

module.exports.createBook = async (req, res) => {
  try {
    // VERIFICATION DE LA PRESENCE D'UN CONTENU
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Votre requête ne contient aucun livre" });
    }
    // EXTRACTION DES DONNEES DU FORMDATA
    const bookData = JSON.parse(req.body.book);
    const { userId, title, author, year, genre, ratings } = bookData;
    let imageUrl = "";
    // STOCKAGE DE L'URL DE L'IMAGE
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }
    // CREATION D'UN NOUVEAU BOOK
    const newBook = new BookModel({
      userId,
      title,
      author,
      year,
      genre,
      imageUrl,
      ratings,
    });
    // ENVOI DU NOUVEAU BOOK DANS LA DB
    const createdBook = await newBook.save();
    res
      .status(201)
      .json({ message: "Nouveau livre enregistré", book: createdBook });
    // GESTION DES ERREURS
  } catch (err) {
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création du livre",
      err: err,
    });
  }
};

module.exports.editBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Livre introuvable" });
    }
    // EXTRACTION DES DONNEES DU BODY
    const { userId, title, author, year, genre } = req.body;
    let imageUrl = book.imageUrl;
    // STOCKAGE DE L'URL DE L'IMAGE
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }
    // MISE A JOUR DU BOOK
    book.userId = userId;
    book.title = title;
    book.author = author;
    book.year = year;
    book.genre = genre;
    book.imageUrl = imageUrl;
    // ENVOI DU BOOK ACTUALISE DANS LA DB
    await BookModel.findByIdAndUpdate(bookId, book);
    res.status(200).json({
      message: "Livre mis à jour",
      book: book,
    });
    // GESTION DES ERREURS
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la mise à jour du livre",
      err: err,
    });
  }
};

module.exports.deleteBook = async (req, res) => {
  try {
    const bookToDelete = await BookModel.findOneAndDelete({
      _id: req.params.id,
    });
    console.log(bookToDelete);
    res.status(202).json({ message: "livre supprimé" });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur s'est produite lors de la suppression du livre",
      err: err,
    });
  }
};

module.exports.rateBook = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Votre requête ne contient aucune note" });
    }
    const { userId, rating } = req.body;
    const bookToRate = await BookModel.findById(req.params.id);
    if (
      bookToRate.ratings.some((rating) => {
        return rating.userId === userId;
      })
    ) {
      res.status(400).json({ message: "Vous avez déjà noté ce livre" });
    }
    bookToRate.ratings.push({ userId: userId, grade: rating });
    await bookToRate.save();
    res.status(200).json(bookToRate);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Une erreur est survenue lors de la mise à jour de la note",
    });
  }
};
