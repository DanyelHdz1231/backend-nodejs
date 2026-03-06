const pool = require("../db/connection");

exports.getAllUsers = async ({ limit, offset }) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, created_at FROM users ORDER BY created_at ASC LIMIT ? OFFSET ?",
    [limit, offset],
  );
  return rows;
};

exports.countUsers = async () => {
  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM users`);

  return rows[0].total;
};
