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

    if (!password || password.trim() === "") {
      const error = new Error("Password esta vacio");
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
