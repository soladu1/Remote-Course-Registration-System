const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./initDatabase");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/courses", require("./routes/courseRoutes"));
app.use("/registration", require("./routes/registrationRoutes"));
app.use("/students", require("./routes/studentRoutes"));

const startServer = async () => {
  try {
    await initializeDatabase();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Failed to initialize database", error);
    process.exit(1);
  }
};

startServer();
