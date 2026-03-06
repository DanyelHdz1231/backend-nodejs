const authService = require("../services/authService");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim() === "") {
      const error = new Error("Nombre esta vacio");
      error.status = 400;
      return next(error);
    }

    if (!email || email.trim() === "") {
      const error = new Error("Email esta vacio");
      error.status = 400;
      return next(error);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Formato de email inválido");
      error.status = 400;
      return next(error);
    }

    if (!password || password.trim() === "") {
      const error = new Error("Password esta vacio");
      error.status = 400;
      return next(error);
    }

    if (password.length < 6) {
      const error = new Error("La contraseña debe tener al menos 6 caracteres");
      error.status = 400;
      return next(error);
    }

    const userInsert = await authService.register({
      name,
      email,
      password,
    });

    res.status(201).json(userInsert);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || email.trim() === "") {
      const error = new Error("Email esta vacio");
      error.status = 400;
      return next(error);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Formato de email inválido");
      error.status = 400;
      return next(error);
    }

    if (!password || password.trim() === "") {
      const error = new Error("Password esta vacio");
      error.status = 400;
      return next(error);
    }

    const response = await authService.login({
      email,
      password,
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.Me = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (isNaN(userId) || userId < 1) {
      const error = new Error("ID inválido");
      error.status = 400;
      return next(error);
    }

    const user = await authService.Me(userId);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
