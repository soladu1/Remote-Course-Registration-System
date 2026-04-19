const db = require("./config/db");

const courses = [
  {
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS102",
    name: "Programming Fundamentals",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS201",
    name: "Data Structures",
    department: "Computer Science",
    credits: 4,
    capacity: 25,
  },
  {
    code: "CS202",
    name: "Algorithms",
    department: "Computer Science",
    credits: 4,
    capacity: 25,
  },
  {
    code: "CS301",
    name: "Operating Systems",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS302",
    name: "Computer Networks",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS303",
    name: "Database Systems",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS304",
    name: "Software Engineering",
    department: "Computer Science",
    credits: 4,
    capacity: 25,
  },
  {
    code: "CS401",
    name: "Artificial Intelligence",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS402",
    name: "Machine Learning",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS403",
    name: "Computer Graphics",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS404",
    name: "Cybersecurity",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS405",
    name: "Web Development",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS406",
    name: "Mobile App Development",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS501",
    name: "Distributed Systems",
    department: "Computer Science",
    credits: 4,
    capacity: 25,
  },
  {
    code: "CS502",
    name: "Cloud Computing",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS503",
    name: "Big Data Analytics",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS504",
    name: "Internet of Things",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS505",
    name: "Blockchain Technology",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS506",
    name: "Quantum Computing",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS601",
    name: "Advanced Algorithms",
    department: "Computer Science",
    credits: 4,
    capacity: 20,
  },
  {
    code: "CS602",
    name: "Computer Vision",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS603",
    name: "Natural Language Processing",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS604",
    name: "Human-Computer Interaction",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS605",
    name: "Parallel Computing",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS606",
    name: "Compiler Design",
    department: "Computer Science",
    credits: 4,
    capacity: 25,
  },
  {
    code: "CS607",
    name: "Game Development",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS608",
    name: "Ethical Hacking",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS609",
    name: "Data Mining",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
  {
    code: "CS610",
    name: "Robotics",
    department: "Computer Science",
    credits: 3,
    capacity: 30,
  },
];

courses.forEach((course) => {
  db.query(
    "INSERT INTO courses (code, name, department, credits, capacity, enrolled) VALUES (?, ?, ?, ?, ?, 0)",
    [
      course.code,
      course.name,
      course.department,
      course.credits,
      course.capacity,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting course:", course.code, err);
      } else {
        console.log("Inserted course:", course.code);
      }
    },
  );
});

// Close the connection after a delay to allow inserts to complete
setTimeout(() => {
  db.end();
  console.log("Database connection closed.");
}, 5000);
