const validator = require("validator");

module.exports.emailChecker = (req, res, next) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ message: "format de l'adresse email invalide" });
  }
  next();
};
