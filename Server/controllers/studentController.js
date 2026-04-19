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

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  db.query(
    "SELECT id, username, password, name, email, role, major, year FROM students WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res
          .status(401)
          .json({ message: "Invalid username or password" });

      const user = results[0];
      bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
        if (bcryptErr) return res.status(500).json(bcryptErr);
        if (!isMatch)
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        res.json(sanitizeStudent(user));
      });
    },
  );
};

exports.register = (req, res) => {
  const { username, password, name, email, major, year } = req.body;
  if (!username || !password || !name || !email || !major || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "SELECT id, username, email FROM students WHERE username = ? OR email = ?",
    [username, email],
    (err, existing) => {
      if (err) return res.status(500).json(err);
      if (existing.some((student) => student.email === email)) {
        return res.status(409).json({
          message:
            "Email is already registered. Please login to your account",
        });
      }
      if (existing.some((student) => student.username === username))
        return res.status(409).json({ message: "Username already exists" });

      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) return res.status(500).json(hashErr);

        db.query(
          "INSERT INTO students (username, password, name, email, role, major, year) VALUES (?,?,?,?,?,?,?)",
          [username, hashedPassword, name, email, "Student", major, year],
          (err, result) => {
            if (err) return res.status(500).json(err);
            const newId = result.insertId;
            db.query(
              "SELECT id, username, name, email, role, major, year FROM students WHERE id = ?",
              [newId],
              (err, rows) => {
                if (err) return res.status(500).json(err);
                res.status(201).json(sanitizeStudent(rows[0]));
              },
            );
          },
        );
      });
    },
  );
};

exports.getStudent = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id, username, name, email, role, major, year FROM students WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(404).json({ message: "Student not found" });
      res.json(sanitizeStudent(results[0]));
    },
  );
};

exports.updateStudent = (req, res) => {
  const { id } = req.params;
  const { name, email, major, year } = req.body;
  if (!name || !email || !major || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "UPDATE students SET name = ?, email = ?, major = ?, year = ? WHERE id = ?",
    [name, email, major, year, id],
    (err) => {
      if (err) return res.status(500).json(err);
      db.query(
        "SELECT id, username, name, email, role, major, year FROM students WHERE id = ?",
        [id],
        (err, results) => {
          if (err) return res.status(500).json(err);
          if (results.length === 0)
            return res.status(404).json({ message: "Student not found" });
          res.json({ success: true, student: sanitizeStudent(results[0]) });
        },
      );
    },
  );
};

exports.getAllStudents = (req, res) => {
  db.query(
    "SELECT id, username, name, email, role, major, year FROM students",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    },
  );
};
