const pool = require("../db/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async ({ name, email, password }) => {
  const saltRounds = 12;

  const [rows] = await pool.query(`SELECT id FROM users WHERE email = ?`, [
    email,
  ]);

  if (rows.length > 0) {
    const error = new Error("El email ya existe");
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES (?, ?, ?)`,
    [name, email, passwordHash],
  );

  return {
    id: result.insertId,
    name,
    email,
  };
};

exports.login = async ({ email, password }) => {
  const [rows] = await pool.query(
    `SELECT id, password FROM users WHERE email = ?`,
    [email],
  );

  if (rows.length === 0) {
    const error = new Error("Credenciales invalidas");
    error.status = 401;
    throw error;
  }

  const user = rows[0];

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const error = new Error("Credenciales invalidas");
    error.status = 401;
    throw error;
  }

  const payload = { id: user.id };
  const secretKey = process.env.JWT_SECRET;

  const token = jwt.sign(payload, secretKey, {
    expiresIn: "1h",
  });

  return { token };
};
