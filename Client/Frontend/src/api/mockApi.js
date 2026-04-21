// API connector for the real backend server.
// The Vite dev proxy forwards `/api` requests to the backend at http://localhost:5000.
const API_BASE = "https://remote-course-registration-system.onrender.com";

const jsonHeaders = {
  "Content-Type": "application/json",
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);
  if (res.ok) return data;
  throw new Error(data?.message || "Server error");
};

export const api = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/students/login`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  registerStudent: async ({ username, password, name, email, major, year }) => {
    const response = await fetch(`${API_BASE}/students/register`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ username, password, name, email, major, year }),
    });
    return handleResponse(response);
  },

  getStudent: async (studentId) => {
    const response = await fetch(`${API_BASE}/students/${studentId}`);
    return handleResponse(response);
  },

  updateStudent: async (studentId, data) => {
    const response = await fetch(`${API_BASE}/students/${studentId}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getAllCourses: async () => {
    const response = await fetch(`${API_BASE}/courses`);
    return handleResponse(response);
  },

  createCourse: async ({ code, name, department, credits, capacity }) => {
    const response = await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ code, name, department, credits, capacity }),
    });
    return handleResponse(response);
  },

  getAvailableCourses: async (studentId) => {
    const [courses, registeredCourses] = await Promise.all([
      api.getAllCourses(),
      api.getRegisteredCourses(studentId),
    ]);
    const registeredIds = new Set(registeredCourses.map((course) => course.id));
    return courses.filter(
      (course) =>
        !registeredIds.has(course.id) &&
        Number(course.enrolled) < Number(course.capacity),
    );
  },

  getRegisteredCourses: async (studentId) => {
    const response = await fetch(
      `${API_BASE}/registration/status/${studentId}`,
    );
    return handleResponse(response);
  },

  registerForCourse: async (studentId, courseId) => {
    const response = await fetch(`${API_BASE}/registration/register`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ student_id: studentId, course_id: courseId }),
    });
    return handleResponse(response);
  },

  dropCourse: async (studentId, courseId) => {
    const response = await fetch(`${API_BASE}/registration/drop`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ student_id: studentId, course_id: courseId }),
    });
    return handleResponse(response);
  },

  getDemoStudents: async () => {
    const response = await fetch(`${API_BASE}/students`);
    return handleResponse(response);
  },
};
