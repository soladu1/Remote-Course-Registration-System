import React, { useState, useEffect } from "react";
import { useStudent } from "../context/StudentContext";
import { useRefresh } from "../context/RefreshContext";
import UnauthorizedAccess from "./UnauthorizedAccess";
import { api } from "../api/mockApi";
import { BookCheck, Calendar, User, BookOpen, Loader2 } from "lucide-react";

const RegistrationStatus = () => {
  const { student, isStudent } = useStudent();
  const { refreshKey } = useRefresh();
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      if (!student || !isStudent) return;
      setLoading(true);
      try {
        const data = await api.getRegisteredCourses(student.id);
        setRegisteredCourses(data);
        setError("");
      } catch (err) {
        setError("Failed to load registration status");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [student, refreshKey]);

  const totalCredits = registeredCourses.reduce((sum, c) => sum + c.credits, 0);

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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
        Registration Status
      </h2>
      {student && (
        <div className="rounded-3xl bg-gradient-to-r from-indigo-50 to-blue-50 p-5 ring-1 ring-indigo-100 dark:from-slate-900 dark:to-slate-950 dark:ring-slate-800">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800 dark:text-slate-100">
            <User className="w-5 h-5 text-indigo-600" /> Student Information
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2 dark:text-slate-300">
            <div className="rounded-2xl bg-white/70 px-4 py-3 dark:bg-slate-900/80">
              <span className="font-medium">Name:</span> {student.name}
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-3 dark:bg-slate-900/80">
              <span className="font-medium">Email:</span> {student.email}
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-3 dark:bg-slate-900/80">
              <span className="font-medium">Major:</span> {student.major}
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-3 dark:bg-slate-900/80">
              <span className="font-medium">Year:</span> {student.year}
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-3 dark:bg-slate-900/80 md:col-span-2">
              <span className="font-medium">Student ID:</span> {student.id}
            </div>
          </div>
        </div>
      )}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="flex items-center gap-2 font-semibold text-gray-700 dark:text-slate-200">
            <BookCheck className="w-5 h-5 text-indigo-600" /> Currently
            Registered Courses
          </span>
          <span className="text-sm text-gray-600 dark:text-slate-400">
            Total Credits: {totalCredits}
          </span>
        </div>
        {error && (
          <div className="bg-red-50 p-4 text-red-700 dark:bg-red-950/60 dark:text-red-200">
            {error}
          </div>
        )}
        {registeredCourses.length === 0 && !error ? (
          <div className="p-8 text-center text-gray-500 dark:text-slate-400">
            <BookOpen className="mx-auto mb-2 h-12 w-12 text-gray-300 dark:text-slate-700" />
            <p>No courses registered yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-800">
            {registeredCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <div className="font-medium text-gray-800 dark:text-slate-100">
                    {course.code}: {course.name}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-slate-400">
                    <span>{course.credits} credits</span>
                    <span>{course.department || "General"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-emerald-950/60 dark:text-emerald-200">
                    Enrolled
                  </span>
                  <Calendar className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationStatus;
