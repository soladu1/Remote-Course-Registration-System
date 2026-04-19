const db = require("./config/db");

const courses = [
  {
    code: "SE101",
    name: "Software Requirements Engineering",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE102",
    name: "Software Design Principles",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE201",
    name: "Object-Oriented Design",
    department: "Software Engineering",
    credits: 4,
    capacity: 25,
  },
  {
    code: "SE202",
    name: "Design Patterns",
    department: "Software Engineering",
    credits: 4,
    capacity: 25,
  },
  {
    code: "SE301",
    name: "Agile Software Development",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE302",
    name: "Scrum Methodology",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE303",
    name: "Test-Driven Development",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE304",
    name: "Continuous Integration/Deployment",
    department: "Software Engineering",
    credits: 4,
    capacity: 25,
  },
  {
    code: "SE401",
    name: "Version Control Systems",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE402",
    name: "Code Review and Quality Assurance",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE403",
    name: "Refactoring Techniques",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE404",
    name: "Software Architecture",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE405",
    name: "Microservices Design",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE406",
    name: "DevOps Practices",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE501",
    name: "Software Project Management",
    department: "Software Engineering",
    credits: 4,
    capacity: 25,
  },
  {
    code: "SE502",
    name: "Extreme Programming",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE503",
    name: "Behavior-Driven Development",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE504",
    name: "Pair Programming",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE505",
    name: "Software Maintenance",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE506",
    name: "Legacy Code Refactoring",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE601",
    name: "Advanced Software Engineering",
    department: "Software Engineering",
    credits: 4,
    capacity: 20,
  },
  {
    code: "SE602",
    name: "Software Metrics and Measurement",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE603",
    name: "Requirements Traceability",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE604",
    name: "User-Centered Design",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE605",
    name: "Software Configuration Management",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE606",
    name: "Automated Testing",
    department: "Software Engineering",
    credits: 4,
    capacity: 25,
  },
  {
    code: "SE607",
    name: "Performance Engineering",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE608",
    name: "Security in Software Development",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE609",
    name: "Open Source Software Development",
    department: "Software Engineering",
    credits: 3,
    capacity: 30,
  },
  {
    code: "SE610",
    name: "Software Engineering Ethics",
    department: "Software Engineering",
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
