const db = require("../config/db");

exports.register = (req, res) => {
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
  db.query(
    "SELECT * FROM registrations WHERE student_id = ? AND course_id = ?",
    [student_id, course_id],
    (err, existingRows) => {
      if (err) {
        console.error("Duplicate check error:", err);
        return res.status(500).json(err);
      }
      if (existingRows.length > 0) {
        console.log(
          `Student ${student_id} already registered for course ${course_id}`,
        );
        return res
          .status(400)
          .json({ message: "Already registered for this course" });
      }

      db.query(
        "SELECT credits, capacity, enrolled FROM courses WHERE course_id = ?",
        [course_id],
        (err, courseRows) => {
          if (err) {
            console.error("Course lookup error:", err);
            return res.status(500).json(err);
          }
          if (!courseRows.length) {
            console.log(`Course ${course_id} not found`);
            return res.status(404).json({ message: "Course not found" });
          }

          const courseCredits = parseFloat(courseRows[0].credits);
          const courseCapacity = Number(courseRows[0].capacity);
          const courseEnrolled = Number(courseRows[0].enrolled);
          console.log(`Course ${course_id} has ${courseCredits} credits`);

          if (courseEnrolled >= courseCapacity) {
            return res.status(400).json({
              message: "Cannot enroll: this course is already full",
            });
          }

          db.query(
            `SELECT COALESCE(SUM(courses.credits), 0) AS currentCredits
             FROM registrations
             JOIN courses ON registrations.course_id = courses.course_id
             WHERE registrations.student_id = ?`,
            [student_id],
            (err2, creditRows) => {
              if (err2) return res.status(500).json(err2);

              const currentCredits =
                creditRows.length > 0
                  ? parseFloat(creditRows[0]?.currentCredits || 0)
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

              db.query(
                "INSERT INTO registrations (student_id, course_id) VALUES (?,?)",
                [student_id, course_id],
                (err3) => {
                  if (err3) {
                    console.error("Insert error:", err3);
                    return res.status(500).json(err3);
                  }

                  db.query(
                    "UPDATE courses SET enrolled = enrolled + 1 WHERE course_id = ?",
                    [course_id],
                    (err4) => {
                      if (err4) {
                        console.error("Update enrolled error:", err4);
                        return res.status(500).json(err4);
                      }
                      console.log(
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
