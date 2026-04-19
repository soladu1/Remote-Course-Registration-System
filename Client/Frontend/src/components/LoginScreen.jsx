import React, { useState } from "react";
import { useStudent } from "../context/StudentContext";
import { api } from "../api/mockApi";
import {
  User,
  Lock,
  Mail,
  BookOpen,
  CalendarDays,
  Moon,
  Sun,
} from "lucide-react";

const LoginScreen = ({ theme, setTheme }) => {
  const { login } = useStudent();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setName("");
    setEmail("");
    setMajor("");
    setYear("");
    setError("");
    setSuccess("");
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    try {
      const student = await api.login(username.trim(), password);
      login(student);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    try {
      await api.registerStudent({
        username: username.trim(),
        password,
        name: name.trim(),
        email: email.trim(),
        major: major.trim(),
        year: year.trim(),
      });
      setSuccess(
        "Account created successfully. Please login using your username and password.",
      );
      setIsRegistering(false);
      setPassword("");
      setName("");
      setEmail("");
      setMajor("");
      setYear("");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.8),transparent_20%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.15),transparent_22%),linear-gradient(180deg,_rgba(15,23,42,0.45),rgba(2,6,23,0.92))]" />
      <div className="relative mx-auto flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-[0_35px_80px_-25px_rgba(0,0,0,0.1)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-[0_35px_80px_-25px_rgba(15,23,42,0.85)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
          <section className="relative bg-white px-6 py-8 sm:px-7 sm:py-9 dark:bg-slate-950/90">
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
                      {isRegistering ? "Create your profile" : "Welcome back"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                      {isRegistering
                        ? "Register now to manage your classes and student profile."
                        : "Sign in to access the student portal and your courses."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <button
                    type="button"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm shadow-rose-500/10">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm shadow-emerald-500/10">
                {success}
              </div>
            )}
            {!isRegistering && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm shadow-amber-500/10">
                Admin login: username{" "}
                <span className="font-semibold">@sol</span>
                {" "}and password{" "}
                <span className="font-semibold">@sol123</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Username
                </label>
                <div className="relative rounded-3xl border border-gray-300 bg-gray-50 px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-blue-500">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-transparent pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative rounded-3xl border border-gray-300 bg-gray-50 px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-blue-500">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {isRegistering && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="relative rounded-3xl border border-gray-300 bg-gray-50 px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-blue-500">
                      <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-transparent pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Email
                    </label>
                    <div className="relative rounded-3xl border border-gray-300 bg-gray-50 px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-blue-500">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-transparent pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-slate-100 dark:placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Major
                      </label>
                      <input
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="Enter your major"
                        className="w-full rounded-3xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                        Year
                      </label>
                      <div className="relative rounded-3xl border border-gray-300 bg-gray-50 px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-blue-500">
                        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                        <input
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="e.g. Freshman"
                          className="w-full bg-transparent pl-10 text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={isRegistering ? handleRegister : handleLogin}
                className="mt-2 inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:from-blue-400 hover:via-indigo-500 hover:to-purple-500"
              >
                {isRegistering ? "Create account" : "Login"}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-slate-400">
                {isRegistering
                  ? "Already have an account?"
                  : "Need a new account?"}
                <button
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    resetForm();
                  }}
                  className="ml-1 font-semibold text-blue-600 transition hover:text-blue-500"
                >
                  {isRegistering ? "Login" : "Register"}
                </button>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
