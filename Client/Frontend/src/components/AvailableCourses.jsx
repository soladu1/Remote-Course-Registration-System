import React, { useState, useEffect } from "react";
import { useStudent } from "../context/StudentContext";
import { useRefresh } from "../context/RefreshContext";
import UnauthorizedAccess from "./UnauthorizedAccess";
import { api } from "../api/mockApi";
import { BookOpen, Building2, Loader2 } from "lucide-react";

const AvailableCourses = () => {
  const { student, isStudent } = useStudent();
  const { refreshKey } = useRefresh();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      if (!student || !isStudent) return;
      setLoading(true);
      try {
        const data = await api.getAllCourses();
        setCourses(data);
        setError("");
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [student, refreshKey, isStudent]);

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
  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );

  const groupedCourses = Object.entries(
    courses.reduce((groups, course) => {
      const department = course.department || "General";
      if (!groups[department]) {
        groups[department] = [];
      }
      groups[department].push(course);
      return groups;
    }, {}),
  ).sort(([left], [right]) => left.localeCompare(right));

  const renderCourseCard = (course) => (
    <div
      key={course.id}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {course.code}: {course.name}
          </h3>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 border border-gray-200">
              <BookOpen className="h-4 w-4 text-blue-500" /> {course.credits}{" "}
              credits
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-2">
              <Building2 className="h-4 w-4 text-indigo-500" />
              {course.department}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 text-right sm:items-end">
          <span
            className={`inline-flex rounded-full px-3 py-2 text-sm font-semibold ${
              course.enrolled >= course.capacity
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {course.enrolled}/{course.capacity} enrolled
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 p-6 shadow-sm ring-1 ring-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 dark:ring-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Available Courses
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Browse all uploaded department courses and review the credit and
          current enrollment status.
        </p>
      </div>
      {groupedCourses.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
          No uploaded courses are available yet.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {groupedCourses.map(([department, departmentCourses]) => (
          <section key={department} className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {department}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Courses uploaded under the {department} department.
              </p>
            </div>
            <div className="space-y-4">
              {departmentCourses.map(renderCourseCard)}
            </div>
          </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableCourses;
