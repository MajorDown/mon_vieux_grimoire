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
  averageRating: {
    type: Number,
    default: function () {
      const grades = this.ratings.map((rating) => rating.grade);
      const average =
        grades.reduce((total, grade) => total + grade, 0) / grades.length;
      return average.toFixed(1);
    },
  },
});

bookSchema.post("save", function (doc) {
  const grades = doc.ratings.map((rating) => rating.grade);
  const average =
    grades.reduce((total, grade) => total + grade, 0) / grades.length;
  doc.averageRating = average.toFixed(1);
  doc.save();
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
