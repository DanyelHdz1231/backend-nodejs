require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

const errorHandler = require("./middlewares/errorHandler");

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
