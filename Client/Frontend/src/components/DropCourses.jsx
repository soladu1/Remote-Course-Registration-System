import React, { useState, useEffect } from "react";
import { useStudent } from "../context/StudentContext";
import { useRefresh } from "../context/RefreshContext";
import UnauthorizedAccess from "./UnauthorizedAccess";
import { api } from "../api/mockApi";
import { Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";

const DropCourses = () => {
  const { student, isStudent } = useStudent();
  const { refreshKey, triggerRefresh } = useRefresh();
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRegisteredCourses = async () => {
      if (!student || !isStudent) return;
      setLoading(true);
      try {
        const data = await api.getRegisteredCourses(student.id);
        setRegisteredCourses(data);
        setError("");
      } catch (err) {
        setError("Failed to load registered courses");
      } finally {
        setLoading(false);
      }
    };

    loadRegisteredCourses();
  }, [student, refreshKey, isStudent]);

  const handleDrop = async (courseId) => {
    if (!student) return;
    setProcessingId(courseId);
    setMessage({ type: "", text: "" });
    try {
      const result = await api.dropCourse(student.id, courseId);
      setMessage({ type: "success", text: result.message });
      triggerRefresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to drop course",
      });
    } finally {
      setProcessingId(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (!student || !isStudent) {
    return (
      <UnauthorizedAccess message="Student access only. Please login with a student account." />
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
      <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 p-6 shadow-sm ring-1 ring-rose-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
          Drop Courses
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Remove active registrations when you need to free up your schedule.
        </p>
      </div>

      {message.text && (
        <div
          className={`flex items-center gap-2 rounded-3xl border p-4 ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200" : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200"}`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200">
          {error}
        </div>
      )}

      {registeredCourses.length === 0 && !error ? (
        <div className="rounded-3xl bg-gray-50 py-12 text-center ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-gray-500 dark:text-slate-400">
            No registered courses available to drop.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {registeredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-950/80"
            >
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-slate-100">
                  {course.code}: {course.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {course.credits} credits
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-500">
                  Department: {course.department || "General"}
                </p>
              </div>
              <button
                onClick={() => handleDrop(course.id)}
                disabled={processingId === course.id}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {processingId === course.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Drop
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropCourses;
