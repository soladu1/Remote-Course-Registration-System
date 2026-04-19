const bcrypt = require("bcryptjs");
const db = require("./config/db");

const ADMIN_USERNAME = "@sol";
const ADMIN_PASSWORD = "@sol123";

const initializeDatabase = async () => {
  const connection = db.promise();

  await connection.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      role VARCHAR(50) NOT NULL DEFAULT 'Student',
      major VARCHAR(255) NOT NULL,
      year VARCHAR(100) NOT NULL
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS courses (
      course_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      department VARCHAR(100) NOT NULL DEFAULT 'General',
      credits DECIMAL(4,1) NOT NULL,
      capacity INT NOT NULL,
      enrolled INT NOT NULL DEFAULT 0
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      course_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_registration (student_id, course_id),
      CONSTRAINT fk_registrations_student
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_registrations_course
        FOREIGN KEY (course_id) REFERENCES courses(course_id)
        ON DELETE CASCADE
    )
  `);

  await ensureColumn(
    connection,
    "courses",
    "department",
    "VARCHAR(100) NOT NULL DEFAULT 'General'",
  );
  await ensureColumn(
    connection,
    "students",
    "role",
    "VARCHAR(50) NOT NULL DEFAULT 'Student'",
  );
  await ensureColumn(
    connection,
    "students",
    "major",
    "VARCHAR(255) NOT NULL DEFAULT 'Undeclared'",
  );
  await ensureColumn(
    connection,
    "students",
    "year",
    "VARCHAR(100) NOT NULL DEFAULT 'Year 1'",
  );
  await ensureUniqueIndex(connection, "students", "email", "unique_students_email");

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const [admins] = await connection.query(
    "SELECT id FROM students WHERE username = ? LIMIT 1",
    [ADMIN_USERNAME],
  );

  if (admins.length === 0) {
    await connection.query(
      `INSERT INTO students (username, password, name, email, role, major, year)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        ADMIN_USERNAME,
        hashedPassword,
        "Sol Admin",
        "sol.admin@system.local",
        "Admin",
        "Administration",
        "Staff",
      ],
    );
    console.log(`Seeded admin account for ${ADMIN_USERNAME}`);
  } else {
    await connection.query(
      `UPDATE students
       SET password = ?, name = ?, email = ?, role = ?, major = ?, year = ?
       WHERE username = ?`,
      [
        hashedPassword,
        "Sol Admin",
        "sol.admin@system.local",
        "Admin",
        "Administration",
        "Staff",
        ADMIN_USERNAME,
      ],
    );
    console.log(`Updated admin account for ${ADMIN_USERNAME}`);
  }
};

const ensureColumn = async (connection, tableName, columnName, definition) => {
  const [rows] = await connection.query(
    `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `,
    [tableName, columnName],
  );

  if (rows.length === 0) {
    await connection.query(
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`,
    );
  }
};

const ensureUniqueIndex = async (connection, tableName, columnName, indexName) => {
  const [rows] = await connection.query(
    `
      SELECT INDEX_NAME
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
        AND NON_UNIQUE = 0
    `,
    [tableName, columnName],
  );

  if (rows.length === 0) {
    await connection.query(
      `ALTER TABLE ${tableName} ADD CONSTRAINT ${indexName} UNIQUE (${columnName})`,
    );
  }
};

module.exports = {
  initializeDatabase,
};
