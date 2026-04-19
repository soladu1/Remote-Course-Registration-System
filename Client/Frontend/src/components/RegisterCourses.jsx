import React, { useState, useEffect } from "react";
import { useStudent } from "../context/StudentContext";
import { useRefresh } from "../context/RefreshContext";
import UnauthorizedAccess from "./UnauthorizedAccess";
import { api } from "../api/mockApi";
import { Plus, Loader2, CheckCircle, XCircle } from "lucide-react";

const RegisterCourses = () => {
  const { student, isStudent } = useStudent();
  const { refreshKey, triggerRefresh } = useRefresh();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvailable = async () => {
      if (!student || !isStudent) return;
      setLoading(true);
      try {
        const data = await api.getAvailableCourses(student.id);
        setAvailableCourses(data);
        setError("");
      } catch (err) {
        setError("Failed to load available courses");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailable();
  }, [student, refreshKey, isStudent]);

  const handleRegister = async (courseId) => {
    setProcessingId(courseId);
    setMessage({ type: "", text: "" });
    try {
      const result = await api.registerForCourse(student.id, courseId);
      setMessage({ type: "success", text: result.message });
      triggerRefresh();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setProcessingId(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (!student || !isStudent)
    return (
      <UnauthorizedAccess message="Student access only. Please login with a student account." />
    );

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div>
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-sky-50 via-indigo-50 to-violet-50 p-6 shadow-sm ring-1 ring-slate-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Register for Courses
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Select courses from the list below and complete your registration
              with a single click.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
            <Plus className="h-4 w-4 text-indigo-600" /> Student action
          </div>
        </div>
      </div>
      {message.text && (
        <div
          className={`mb-4 rounded-3xl p-4 text-sm font-medium shadow-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-200 dark:ring-emerald-900" : "bg-rose-50 text-rose-700 ring-1 ring-rose-100 dark:bg-rose-950/60 dark:text-rose-200 dark:ring-rose-900"}`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-3xl bg-red-50 p-4 text-red-700 ring-1 ring-red-100 dark:bg-red-950/60 dark:text-red-200 dark:ring-red-900">
          {error}
        </div>
      )}
      {availableCourses.length === 0 && !error ? (
        <div className="rounded-3xl bg-gray-50 p-10 text-center text-gray-500 shadow-sm ring-1 ring-gray-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
          <p>No available courses to register.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {availableCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {course.code}: {course.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {course.credits} credits
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                    Department: {course.department || "General"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                    Available: {course.capacity - course.enrolled} seats
                  </p>
                </div>
                <button
                  onClick={() => handleRegister(course.id)}
                  disabled={processingId === course.id}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId === course.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisterCourses;
