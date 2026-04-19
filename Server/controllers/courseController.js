const db = require("../config/db");

exports.getCourses = async (req, res) => {
  try {
    const result = await db.query(
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
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addCourse = async (req, res) => {
  try {
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
      return res
        .status(400)
        .json({ message: "All course fields are required" });
    }

    if (numericCredits <= 0 || numericCapacity <= 0) {
      return res
        .status(400)
        .json({ message: "Credits and capacity must be greater than zero" });
    }

    const existingResult = await db.query(
      "SELECT course_id FROM courses WHERE code = $1 LIMIT 1",
      [normalizedCode],
    );
    if (existingResult.rows.length > 0) {
      return res.status(409).json({
        message: "A course with this code already exists",
      });
    }

    const insertResult = await db.query(
      `INSERT INTO courses (code, name, department, credits, capacity, enrolled)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING course_id`,
      [
        normalizedCode,
        normalizedName,
        normalizedDepartment,
        numericCredits,
        numericCapacity,
        enrolled,
      ],
    );
    res.status(201).json({
      message: "Course added successfully",
      id: insertResult.rows[0].course_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
