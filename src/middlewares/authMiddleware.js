const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.JWT_SECRET;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Token requerido");
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;

    next();
  } catch (error) {
    const authError = new Error("Token invalido o expirado");
    authError.status = 401;
    next(authError);
  }
};
