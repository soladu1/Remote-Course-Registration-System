import React, { useState, useEffect } from "react";
import { useStudent } from "../context/StudentContext";
import { useRefresh } from "../context/RefreshContext";
import UnauthorizedAccess from "./UnauthorizedAccess";
import { api } from "../api/mockApi";
import { Save, Loader2, CheckCircle, XCircle, User } from "lucide-react";

const UpdateStudentInfo = () => {
  const { student, login, isStudent } = useStudent();
  const { triggerRefresh } = useRefresh();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    major: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      if (!student || !isStudent) return;
      setInitialLoading(true);
      try {
        const data = await api.getStudent(student.id);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          major: data.major || "",
          year: data.year || "",
        });
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load student data" });
      } finally {
        setInitialLoading(false);
      }
    };
    loadStudentData();
  }, [student, isStudent]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await api.updateStudent(student.id, formData);
      login({ ...student, ...formData });
      triggerRefresh();
      setMessage({
        type: "success",
        text: "Student information updated successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update information",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (!student || !isStudent) {
    return (
      <UnauthorizedAccess message="Student access only. Please login with a student account." />
    );
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 p-6 shadow-sm ring-1 ring-cyan-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
          Update Student Information
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Keep your profile details current so registration and contact info stay accurate.
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

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl bg-gray-50 p-6 ring-1 ring-gray-200 dark:bg-slate-950/80 dark:ring-slate-800"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Major
            </label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select Year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </form>

      <div className="text-center text-xs text-gray-400 dark:text-slate-500">
        <User className="mr-1 inline h-3 w-3" /> Student ID: {student?.id}
      </div>
    </div>
  );
};

export default UpdateStudentInfo;
