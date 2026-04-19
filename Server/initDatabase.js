const bcrypt = require("bcryptjs");
const db = require("./config/db");

const ADMIN_USERNAME = "@sol";
const ADMIN_PASSWORD = "@sol123";

const initializeDatabase = async () => {
  const connection = db;

  await connection.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
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
      course_id SERIAL PRIMARY KEY,
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
      id SERIAL PRIMARY KEY,
      student_id INT NOT NULL,
      course_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (student_id, course_id),
      CONSTRAINT fk_registrations_student
        FOREIGN KEY (student_id) REFERENCES students(id)
        ON DELETE CASCADE,
      CONSTRAINT fk_registrations_course
        FOREIGN KEY (course_id) REFERENCES courses(course_id)
        ON DELETE CASCADE
    )
  `);

  // Add columns if missing
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

  // Unique constraints
  await ensureUniqueIndex(
    connection,
    "students",
    "email",
    "unique_students_email",
  );

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const adminResult = await connection.query(
    "SELECT id FROM students WHERE username = $1 LIMIT 1",
    [ADMIN_USERNAME],
  );
  const admins = adminResult.rows;

  if (admins.length === 0) {
    await connection.query(
      `INSERT INTO students (username, password, name, email, role, major, year)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
       SET password = $1, name = $2, email = $3, role = $4, major = $5, year = $6
       WHERE username = $7`,
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
  const result = await connection.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
    `,
    [tableName, columnName],
  );

  if (result.rows.length === 0) {
    await connection.query(
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`,
    );
  }
};

const ensureUniqueIndex = async (
  connection,
  tableName,
  columnName,
  indexName,
) => {
  const result = await connection.query(
    `
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = $1
        AND indexname = $2
    `,
    [tableName, indexName],
  );

  if (result.rows.length === 0) {
    await connection.query(
      `ALTER TABLE ${tableName} ADD CONSTRAINT ${indexName} UNIQUE (${columnName})`,
    );
  }
};

module.exports = {
  initializeDatabase,
};
