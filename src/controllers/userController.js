const { json } = require("express");
const userService = require("../services/userService");

exports.getUsers = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    let limit = parseInt(req.query.limit) || 10;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    const [users, totalItems] = await Promise.all([
      userService.getAllUsers({ limit, offset }),
      userService.countUsers(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      data: users,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};
