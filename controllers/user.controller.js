const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const { tokenMaker } = require("../middlewares/tokenManager");

module.exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const checkedUserMail = await UserModel.findOne({ email });
    if (checkedUserMail) {
      return res
        .status(400)
        .json({ message: "Cette adresse mail est déjà utilisée !" });
    }
    // Créer un nouvel utilisateur
    const newUser = new UserModel({ email, password });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création de votre compte",
      err: err,
    });
  }
};

module.exports.connectUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Vérifier si l'utilisateur existe dans la base de données
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "email / mdp incorrects" });
    }
    // Vérifier si le mot de passe est correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "email / mdp incorrects" });
    }
    // Générer et envoyer le token dans un cookie
    const token = tokenMaker(user._id);
    res.status(200).json({
      userId: user._id,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Une erreur s'est produite lors de votre tentative de connexion",
      err: err,
    });
  }
};
