const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase } = require("./initDatabase");

const app = express();

// ✅ CORS for frontend
app.use(cors({
  origin: "https://remotecourseregistrationsystem.netlify.app",
  credentials: true
}));

app.use(express.json());

// routes
app.use("/courses", require("./routes/courseRoutes"));
app.use("/registration", require("./routes/registrationRoutes"));
app.use("/students", require("./routes/studentRoutes"));

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  try {
    await initializeDatabase();
    console.log("Database connected");
  } catch (err) {
    console.error("DB init failed:", err);
  }
});