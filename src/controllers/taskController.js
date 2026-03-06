const taskService = require("../services/taskService");

exports.getTasks = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    if (page < 1) page = 1;

    let limit = parseInt(req.query.limit) || 10;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;
    const userId = req.user.id;
    const isCompleted = req.query.completed;
    let completed;
    if (
      isCompleted !== "true" &&
      isCompleted !== "false" &&
      isCompleted !== undefined
    ) {
      const error = new Error("Valor invalido para 'completed'");
      error.status = 400;
      return next(error);
    }
    if (isCompleted === "false") completed = false;
    if (isCompleted === "true") completed = true;

    const [tasks, totalItems] = await Promise.all([
      taskService.getAllTasks({
        userId,
        limit,
        offset,
        isCompleted: completed,
      }),
      taskService.countTasks({ userId, isCompleted: completed }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    return res.status(200).json({
      data: tasks,
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

exports.createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      const error = new Error("Texto esta vacio");
      error.status = 400;
      return next(error);
    }

    const insertId = await taskService.createTask({ text, userId });

    res.status(201).json({
      id: insertId,
      text,
      completed: false,
      userId: userId,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const taskId = parseInt(req.params.id);

    if (isNaN(taskId) || taskId < 1) {
      const error = new Error("ID invalido");
      error.status = 400;
      return next(error);
    }

    const affectedRows = await taskService.deleteTask({ id: taskId, userId });

    if (affectedRows === 0) {
      const error = new Error("Task no encontrada");
      error.status = 404;
      return next(error);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.toggleTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    if (isNaN(taskId) || taskId < 1) {
      const error = new Error("ID invalido");
      error.status = 400;
      return next(error);
    }
    const toggleResponse = await taskService.toggleTask({ id: taskId, userId });

    if (toggleResponse === 0) {
      const error = new Error("Task no encontrada");
      error.status = 404;
      return next(error);
    }

    res.status(200).json(toggleResponse);
  } catch (error) {
    next(error);
  }
};

exports.updateTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    const { text } = req.body;

    if (!text || text.trim() === "") {
      const error = new Error("Texto esta vacio");
      error.status = 400;
      return next(error);
    }

    if (isNaN(taskId) || taskId < 1) {
      const error = new Error("ID invalido");
      error.status = 400;
      return next(error);
    }

    const task = await taskService.updateTask({ id: taskId, text, userId });

    if (task === 0) {
      const error = new Error("Task no encontrada");
      error.status = 404;
      return next(error);
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
