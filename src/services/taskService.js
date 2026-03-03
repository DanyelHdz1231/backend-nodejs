const pool = require("../db/connection");

exports.getAllTasks = async (userId) => {
  const [rows] = await pool.query(
    `SELECT id, text, completed, created_at
     FROM tasks
     WHERE user_id = ?
     ORDER BY created_at ASC`,
    [userId],
  );

  return rows;
};

exports.createTask = async ({ text, userId }) => {
  const [result] = await pool.query(
    `INSERT INTO tasks (text, user_id) VALUES (?, ?)`,
    [text, userId],
  );

  return result.insertId;
};

exports.deleteTask = async ({ id, userId }) => {
  const [result] = await pool.query(
    `DELETE FROM tasks WHERE id= ? AND user_id= ?`,
    [id, userId],
  );
  return result.affectedRows;
};

exports.toggleTask = async ({ id, userId }) => {
  const [result] = await pool.query(
    `UPDATE tasks
     SET completed = NOT completed
     WHERE id = ? AND user_id= ?`,
    [id, userId],
  );

  const affectedRows = result.affectedRows;

  if (affectedRows === 0) {
    return 0;
  }

  const [rows] = await pool.query(
    `SELECT id, text, completed, created_at
     FROM tasks
     WHERE id = ?`,
    [id],
  );

  return rows[0];
};
