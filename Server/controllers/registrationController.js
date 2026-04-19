const db = require("../config/db");

exports.register = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    console.log(
      `Registration attempt: student_id=${student_id}, course_id=${course_id}`,
    );
    if (!student_id || !course_id) {
      return res
        .status(400)
        .json({ message: "Student ID and course ID are required" });
    }

    // First check if student is already registered for this course
    const existingResult = await db.query(
      "SELECT * FROM registrations WHERE student_id = $1 AND course_id = $2",
      [student_id, course_id]
    );
    if (existingResult.rows.length > 0) {
      console.log(
        `Student ${student_id} already registered for course ${course_id}`,
      );
      return res
        .status(400)
        .json({ message: "Already registered for this course" });
    }

    const courseResult = await db.query(
      "SELECT credits, capacity, enrolled FROM courses WHERE course_id = $1",
      [course_id]
    );
    if (courseResult.rows.length === 0) {
      console.log(`Course ${course_id} not found`);
      return res.status(404).json({ message: "Course not found" });
    }

    const courseCredits = parseFloat(courseResult.rows[0].credits);
    const courseCapacity = Number(courseResult.rows[0].capacity);
    const courseEnrolled = Number(courseResult.rows[0].enrolled);
    console.log(`Course ${course_id} has ${courseCredits} credits`);

    if (courseEnrolled >= courseCapacity) {
      return res.status(400).json({
        message: "Cannot enroll: this course is already full",
      });
    }

    const creditResult = await db.query(
      `SELECT COALESCE(SUM(courses.credits), 0) AS currentCredits
       FROM registrations
       JOIN courses ON registrations.course_id = courses.course_id
       WHERE registrations.student_id = $1`,
      [student_id]
    );

    const currentCredits =
      creditResult.rows.length > 0
        ? parseFloat(creditResult.rows[0]?.currentcredits || 0)
        : 0;
    console.log(
      `Student ${student_id} current credits: ${currentCredits}, trying to add ${courseCredits}`,
    );
    console.log(`Total would be: ${currentCredits + courseCredits}`);

    if (currentCredits + courseCredits > 35) {
      console.log(
        `Credit limit exceeded: ${currentCredits} + ${courseCredits} = ${currentCredits + courseCredits} > 35`,
      );
      return res.status(400).json({
        message: `Cannot enroll: credit limit exceeded. Current credits: ${currentCredits}, adding ${courseCredits} would exceed 35 credit hours per semester.`,
      });
    }

    await db.query(
      "INSERT INTO registrations (student_id, course_id) VALUES ($1, $2)",
      [student_id, course_id]
    );

    await db.query(
      "UPDATE courses SET enrolled = enrolled + 1 WHERE course_id = $1",
      [course_id]
    );

    console.log(
      `Successfully registered student ${student_id} for course ${course_id}`,
    );
    res.json({ message: "Successfully registered for the course" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json(err);
  }
};

exports.drop = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    console.log(
      `Drop attempt: student_id=${student_id}, course_id=${course_id}`,
    );
    if (!student_id || !course_id) {
      return res
        .status(400)
        .json({ message: "Student ID and course ID are required" });
    }

    const existingResult = await db.query(
      "SELECT * FROM registrations WHERE student_id = $1 AND course_id = $2",
      [student_id, course_id]
    );
    if (existingResult.rows.length === 0) {
      console.log(
        `Student ${student_id} not registered for course ${course_id}`,
      );
      return res
        .status(400)
        .json({ message: "Not registered for this course" });
    }

    await db.query(
      "DELETE FROM registrations WHERE student_id = $1 AND course_id = $2",
      [student_id, course_id]
    );

    await db.query(
      "UPDATE courses SET enrolled = enrolled - 1 WHERE course_id = $1",
      [course_id]
    );

    console.log(
      `Successfully dropped student ${student_id} from course ${course_id}`,
    );
    res.json({ message: "Successfully dropped the course" });
  } catch (err) {
    console.error("Drop error:", err);
    res.status(500).json(err);
  }
};

exports.getStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log(`Getting registration status for student ${studentId}`);

    const result = await db.query(
      `SELECT
         courses.course_id AS id,
         courses.code,
         courses.name,
         courses.department,
         courses.credits,
         courses.capacity,
         courses.enrolled,
         registrations.created_at
       FROM registrations
       JOIN courses ON registrations.course_id = courses.course_id
       WHERE registrations.student_id = $1
       ORDER BY registrations.created_at DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get status error:", err);
    res.status(500).json(err);
  }
};
                        `Registration successful for student ${student_id}, course ${course_id}`,
                      );
                      res.json({ message: "Registered successfully" });
                    },
                  );
                },
              );
            },
          );
        },
      );
    },
  );
};

exports.drop = (req, res) => {
  const { student_id, course_id } = req.body;
  if (!student_id || !course_id) {
    return res
      .status(400)
      .json({ message: "Student ID and course ID are required" });
  }

  db.query(
    "DELETE FROM registrations WHERE student_id = ? AND course_id = ?",
    [student_id, course_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Registration not found" });
      }

      db.query(
        "UPDATE courses SET enrolled = GREATEST(enrolled - 1, 0) WHERE course_id = ?",
        [course_id],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: "Dropped successfully" });
        },
      );
    },
  );
};

exports.getStatus = (req, res) => {
  const id = req.params.id;

  db.query(
    `SELECT
       courses.course_id AS id,
       courses.code,
       courses.name,
       courses.department,
       courses.credits,
       courses.capacity,
       courses.enrolled
     FROM courses
     JOIN registrations ON courses.course_id = registrations.course_id
     WHERE registrations.student_id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    },
  );
};
