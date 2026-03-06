const pool = require("../db/connection");

exports.getAllTasks = async ({ userId, limit, offset, isCompleted }) => {
  if (isCompleted !== undefined) {
    const [rows] = await pool.query(
      `SELECT id, text, completed, created_at
     FROM tasks
     WHERE user_id = ? AND completed = ?
     ORDER BY created_at ASC LIMIT ? OFFSET ?`,
      [userId, isCompleted, limit, offset],
    );

    return rows;
  }
  const [rows] = await pool.query(
    `SELECT id, text, completed, created_at
     FROM tasks
     WHERE user_id = ?
     ORDER BY created_at ASC LIMIT ? OFFSET ?`,
    [userId, limit, offset],
  );

  return rows;
};

exports.countTasks = async ({ userId, isCompleted }) => {
  if (isCompleted !== undefined) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total FROM tasks WHERE user_id = ? AND completed = ?`,
      [userId, isCompleted],
    );
    return rows[0].total;
  }
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?`,
    [userId],
  );
  return rows[0].total;
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

exports.updateTask = async ({ id, text, userId }) => {
  const [result] = await pool.query(
    ` UPDATE tasks 
    SET text = ? WHERE id= ? AND user_id = ?
    `,
    [text, id, userId],
  );
  const affectedRows = result.affectedRows;

  if (affectedRows === 0) {
    return 0;
  }

  const [rows] = await pool.query(
    `SELECT id, text, completed, created_at
     FROM tasks
     WHERE id = ? AND user_id = ?`,
    [id, userId],
  );
  return rows[0];
};
