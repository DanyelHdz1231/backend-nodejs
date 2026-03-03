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

exports.getUsersOrders = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
  orders.id,
  orders.created_at,
  SUM(order_details.quantity * order_details.price) AS total
FROM orders
JOIN order_details ON order_details.order_id = orders.id
WHERE orders.user_id = ?
GROUP BY orders.id, orders.created_at
ORDER BY orders.created_at ASC;`,
    [userId],
  );
  return rows;
};

exports.getTopSpenders = async () => {
  const [rows] = await pool.query(
    `SELECT 
  users.id,
  users.name,
  SUM(order_details.quantity * order_details.price) AS totalGastado
FROM users
JOIN orders ON orders.user_id = users.id
JOIN order_details ON order_details.order_id = orders.id
GROUP BY users.id, users.name
ORDER BY totalGastado DESC
LIMIT 5`,
  );
  return rows;
};
