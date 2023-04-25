const bcrypt = require("bcrypt");

module.exports.passwordCrypter = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors du hachage du mot de passe",
      error: error,
    });
  }
};
