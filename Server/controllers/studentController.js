const db = require("../config/db");
const bcrypt = require("bcryptjs");

const sanitizeStudent = (student) => ({
  id: student.id,
  username: student.username,
  name: student.name,
  email: student.email,
  role: student.role,
  major: student.major,
  year: student.year,
});

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const result = await db.query(
      "SELECT id, username, password, name, email, role, major, year FROM students WHERE username = $1",
      [username],
    );
    const results = result.rows;

    if (results.length === 0)
      return res.status(401).json({ message: "Invalid username or password" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid username or password" });
    res.json(sanitizeStudent(user));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, name, email, major, year } = req.body;
    if (!username || !password || !name || !email || !major || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingResult = await db.query(
      "SELECT id, username, email FROM students WHERE username = $1 OR email = $2",
      [username, email],
    );
    const existing = existingResult.rows;

    if (existing.some((student) => student.email === email)) {
      return res.status(409).json({
        message: "Email is already registered. Please login to your account",
      });
    }
    if (existing.some((student) => student.username === username))
      return res.status(409).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await db.query(
      "INSERT INTO students (username, password, name, email, role, major, year) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [username, hashedPassword, name, email, "Student", major, year],
    );
    const newId = insertResult.rows[0].id;

    const selectResult = await db.query(
      "SELECT id, username, name, email, role, major, year FROM students WHERE id = $1",
      [newId],
    );
    res.status(201).json(sanitizeStudent(selectResult.rows[0]));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT id, username, name, email, role, major, year FROM students WHERE id = $1",
      [id],
    );
    const results = result.rows;

    if (results.length === 0)
      return res.status(404).json({ message: "Student not found" });
    res.json(sanitizeStudent(results[0]));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, major, year } = req.body;

    if (!name || !email || !major || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await db.query(
      "UPDATE students SET name = $1, email = $2, major = $3, year = $4 WHERE id = $5 RETURNING id, username, name, email, role, major, year",
      [name, email, major, year, id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Student not found" });

    res.json(sanitizeStudent(result.rows[0]));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, name, email, role, major, year FROM students ORDER BY id ASC",
    );
    res.json(result.rows.map(sanitizeStudent));
  } catch (err) {
    res.status(500).json(err);
  }
};
