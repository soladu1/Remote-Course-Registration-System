import React, { useEffect, useState } from "react";
import { useStudent } from "../context/StudentContext";
import { useRefresh } from "../context/RefreshContext";
import UnauthorizedAccess from "./UnauthorizedAccess";
import { api } from "../api/mockApi";
import {
  BookOpen,
  BookCheck,
  GraduationCap,
  Loader2,
  Sparkles,
} from "lucide-react";

const StudentHome = ({ onNavigate }) => {
  const { student, isStudent } = useStudent();
  const { refreshKey } = useRefresh();
  const [summary, setSummary] = useState({
    totalCourses: 0,
    registeredCourses: 0,
    totalCredits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      if (!student || !isStudent) return;

      setLoading(true);
      try {
        const [courses, registeredCourses] = await Promise.all([
          api.getAllCourses(),
          api.getRegisteredCourses(student.id),
        ]);

        const totalCredits = registeredCourses.reduce(
          (sum, course) => sum + Number(course.credits || 0),
          0,
        );

        setSummary({
          totalCourses: courses.length,
          registeredCourses: registeredCourses.length,
          totalCredits,
        });
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [student, isStudent, refreshKey]);

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
      <section className="overflow-hidden rounded-[32px] border border-sky-100 bg-[linear-gradient(135deg,#f0f9ff_0%,#eef2ff_55%,#f8fafc_100%)] p-6 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96)_0%,rgba(30,41,59,0.92)_52%,rgba(2,6,23,1)_100%)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-sky-200">
              <Sparkles className="h-4 w-4" />
              Student Home
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome, {student.name}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Review open courses, track your registrations, and keep your
              profile ready for the semester.
            </p>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Student Details
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {student.major}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {student.year}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-semibold">Available Courses</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {summary.totalCourses}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <BookCheck className="h-5 w-5" />
            <span className="text-sm font-semibold">Registered Courses</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {summary.registeredCourses}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm font-semibold">Current Credits</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {summary.totalCredits}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <button
          onClick={() => onNavigate("available")}
          className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80"
        >
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Browse Courses
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            See all uploaded courses by department.
          </p>
        </button>
        <button
          onClick={() => onNavigate("register")}
          className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80"
        >
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Register Now
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Enroll in courses uploaded by the admin.
          </p>
        </button>
        <button
          onClick={() => onNavigate("status")}
          className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80"
        >
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            View Status
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Track your current registered courses and credit load.
          </p>
        </button>
      </section>
    </div>
  );
};

export default StudentHome;
