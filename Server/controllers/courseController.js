const db = require("../config/db");

exports.getCourses = (req, res) => {
  db.query(
    `SELECT
       course_id AS id,
       code,
       name,
       department,
       credits,
       capacity,
       enrolled
     FROM courses
     ORDER BY department ASC, code ASC`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
};

exports.addCourse = (req, res) => {
  const { code, name, department, credits, capacity } = req.body;
  const enrolled = 0; // Start with 0 enrolled
  const normalizedCode = code?.trim().toUpperCase();
  const normalizedName = name?.trim();
  const normalizedDepartment = department?.trim();
  const numericCredits = Number(credits);
  const numericCapacity = Number(capacity);

  if (
    !normalizedCode ||
    !normalizedName ||
    !normalizedDepartment ||
    Number.isNaN(numericCredits) ||
    Number.isNaN(numericCapacity)
  ) {
    return res.status(400).json({ message: "All course fields are required" });
  }

  if (numericCredits <= 0 || numericCapacity <= 0) {
    return res
      .status(400)
      .json({ message: "Credits and capacity must be greater than zero" });
  }

  db.query(
    "SELECT course_id FROM courses WHERE code = ? LIMIT 1",
    [normalizedCode],
    (checkErr, existingRows) => {
      if (checkErr) return res.status(500).json(checkErr);
      if (existingRows.length > 0) {
        return res.status(409).json({
          message: "A course with this code already exists",
        });
      }

      db.query(
        `INSERT INTO courses (code, name, department, credits, capacity, enrolled)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          normalizedCode,
          normalizedName,
          normalizedDepartment,
          numericCredits,
          numericCapacity,
          enrolled,
        ],
        (err, result) => {
          if (err) return res.status(500).json(err);
          res.status(201).json({
            message: "Course added successfully",
            id: result.insertId,
          });
        },
      );
    },
  );
};
