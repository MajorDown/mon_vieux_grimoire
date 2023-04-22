const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, default: 0 },
});

bookSchema.methods.calcAverageRating = function () {
  const grades = this.ratings.map((rating) => rating.grade);
  const average =
    grades.reduce((total, grade) => total + grade, 0) / grades.length;
  this.averageRating = average.toFixed(1);
  return this.averageRating;
};

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
