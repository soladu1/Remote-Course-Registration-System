import React, { useEffect, useMemo, useState } from "react";
import { useStudent } from "../context/StudentContext";
import UnauthorizedAccess from "./UnauthorizedAccess";
import { api } from "../api/mockApi";
import {
  Users,
  BookOpen,
  Activity,
  ShieldCheck,
  Loader2,
  Upload,
  Building2,
} from "lucide-react";

const initialForm = {
  code: "",
  name: "",
  department: "",
  credits: "",
  capacity: "",
};

const AdminPanel = () => {
  const { isAdmin } = useStudent();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    try {
      const [userList, courseList] = await Promise.all([
        api.getDemoStudents(),
        api.getAllCourses(),
      ]);
      setUsers(userList);
      setCourses(courseList);
      setError("");
    } catch (err) {
      setError("Unable to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadAdminData();
  }, [isAdmin]);

  const departmentSummary = useMemo(() => {
    const summary = new Map();
    courses.forEach((course) => {
      const department = course.department || "General";
      summary.set(department, (summary.get(department) || 0) + 1);
    });
    return Array.from(summary.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
  }, [courses]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await api.createCourse(form);
      setMessage({ type: "success", text: result.message });
      setForm(initialForm);
      await loadAdminData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to upload course",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <UnauthorizedAccess message="Admin access only. Please login with an admin account." />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mb-4 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-indigo-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Home Page
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Upload department courses to the database and manage what
              students can enroll in.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-indigo-700">
              <Users className="h-5 w-5" />
              <span className="text-sm font-semibold">Users</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-slate-100">
              {users.length}
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-indigo-700">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-semibold">Courses</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-slate-100">
              {courses.length}
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-indigo-700">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Departments</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-slate-100">
              {departmentSummary.length}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_1.25fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80"
        >
          <div className="mb-5 flex items-center gap-3">
            <Upload className="h-5 w-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">
                Upload Course
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Add one course manually from the home page.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-gray-700 dark:text-slate-300">
              <span className="font-medium">Course Code</span>
              <input
                value={form.code}
                onChange={(event) => handleChange("code", event.target.value)}
                placeholder="e.g. CS410"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-700 dark:text-slate-300">
              <span className="font-medium">Course Name</span>
              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="e.g. Advanced Web Systems"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-700 dark:text-slate-300">
              <span className="font-medium">Department</span>
              <input
                value={form.department}
                onChange={(event) =>
                  handleChange("department", event.target.value)
                }
                placeholder="e.g. Computer Science"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-gray-700 dark:text-slate-300">
                <span className="font-medium">Credits</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={form.credits}
                  onChange={(event) =>
                    handleChange("credits", event.target.value)
                  }
                  placeholder="3"
                  className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="grid gap-2 text-sm text-gray-700 dark:text-slate-300">
                <span className="font-medium">Capacity</span>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) =>
                    handleChange("capacity", event.target.value)
                  }
                  placeholder="40"
                  className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
            </div>
          </div>

          {message.text && (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-sm ${message.type === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-rose-200 bg-rose-50 text-rose-700"}`}
            >
              {message.text}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload Course
          </button>
        </form>

        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mb-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">
                Uploaded Courses
              </h3>
            </div>
            <div className="grid gap-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-3xl border border-gray-200 p-4 transition-colors hover:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {course.code}: {course.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                        Department: {course.department}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-slate-400">
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                        {course.credits} credits
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                        {course.enrolled}/{course.capacity} enrolled
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mb-4 flex items-center gap-3">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">
                Course Departments
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {departmentSummary.map(([department, count]) => (
                <div
                  key={department}
                  className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {department}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {count} uploaded course{count === 1 ? "" : "s"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mb-4 flex items-center gap-3">
              <Users className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">
                User Accounts
              </h3>
            </div>
            <div className="grid gap-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-3xl border border-gray-200 p-4 dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                      {user.role}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                    {user.major} | {user.year}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
