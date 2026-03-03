const taskService = require("../services/taskService");

exports.getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getAllTasks(userId);
    res.status(200).json(tasks);
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
