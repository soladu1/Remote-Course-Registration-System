import React, { useState, useEffect } from "react";
import { StudentProvider, useStudent } from "./context/StudentContext";
import { RefreshProvider } from "./context/RefreshContext";
import LoginScreen from "./components/LoginScreen";
import AvailableCourses from "./components/AvailableCourses";
import RegisterCourses from "./components/RegisterCourses";
import DropCourses from "./components/DropCourses";
import RegistrationStatus from "./components/RegistrationStatus";
import UpdateStudentInfo from "./components/UpdateStudentInfo";
import AdminPanel from "./components/AdminPanel";
import StudentHome from "./components/StudentHome";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Trash2,
  CheckCircle,
  UserCircle,
  LogOut,
  ShieldCheck,
  Moon,
  Sun,
} from "lucide-react";

const studentNavItems = [
  {
    id: "home",
    label: "Home",
    icon: LayoutDashboard,
    component: StudentHome,
  },
  {
    id: "available",
    label: "View Courses",
    icon: BookOpen,
    component: AvailableCourses,
  },
  {
    id: "register",
    label: "Register Courses",
    icon: PlusCircle,
    component: RegisterCourses,
  },
  { id: "drop", label: "Drop Courses", icon: Trash2, component: DropCourses },
  {
    id: "status",
    label: "Registration Status",
    icon: CheckCircle,
    component: RegistrationStatus,
  },
  {
    id: "update",
    label: "Update Info",
    icon: UserCircle,
    component: UpdateStudentInfo,
  },
];

const adminNavItems = [
  {
    id: "overview",
    label: "Home",
    icon: ShieldCheck,
    component: AdminPanel,
  },
];

const Dashboard = ({ theme, setTheme }) => {
  const { student, logout } = useStudent();
  const [activeTab, setActiveTab] = useState(
    student?.role === "Admin" ? "overview" : "home",
  );

  const navItems =
    student?.role === "Admin"
      ? adminNavItems
      : student?.role === "Student"
        ? studentNavItems
        : [];
  const ActiveComponent =
    navItems.find((item) => item.id === activeTab)?.component ||
    navItems[0]?.component;

  useEffect(() => {
    setActiveTab(student?.role === "Admin" ? "overview" : "home");
  }, [student?.role]);

  if (!student || !ActiveComponent) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
        <UnauthorizedAccess message="You do not have permission to view this portal. Please login with a valid Student or Admin account." />
      </div>
    );
  }

  if (student.role === "Admin") {
    return (
      <AdminDashboard
        student={student}
        logout={logout}
        theme={theme}
        setTheme={setTheme}
        ActiveComponent={ActiveComponent}
      />
    );
  }

  return (
    <StudentDashboard
      student={student}
      logout={logout}
      theme={theme}
      setTheme={setTheme}
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      ActiveComponent={ActiveComponent}
    />
  );
};

const AdminDashboard = ({
  student,
  logout,
  theme,
  setTheme,
  ActiveComponent,
}) => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_48%,#e0f2fe_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(49,46,129,0.5),rgba(15,23,42,0.96)_50%,rgba(2,6,23,1)_100%)] dark:text-slate-100">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-sky-200">
                <ShieldCheck className="h-4 w-4" />
                Admin Home
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Manage course uploads from one place
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Signed in as {student.name}. Upload new courses manually, group
                them by department, and control what students can enroll in.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {theme === "dark" ? "Light" : "Dark"} Theme
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/60"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ActiveComponent />
      </main>
    </div>
  );
};

const StudentDashboard = ({
  student,
  logout,
  theme,
  setTheme,
  navItems,
  activeTab,
  setActiveTab,
  ActiveComponent,
}) => {
  const contentProps =
    activeTab === "home" ? { onNavigate: setActiveTab } : {};

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.88),rgba(2,6,23,1)_58%)] dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/90 py-8 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
                  Student Portal
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Welcome back, {student.name}
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Check uploaded courses, register quickly, and manage your
                  semester from your student home.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {theme === "dark" ? "Light" : "Dark"} Theme
              </button>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-3 text-sm font-semibold transition ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-gray-600 hover:bg-white hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" /> {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 lg:grid-cols-1">
          <section className="rounded-[36px] border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
            <ActiveComponent {...contentProps} />
          </section>
        </div>
      </main>
    </div>
  );
};

const AppContent = ({ theme, setTheme }) => {
  const { student } = useStudent();
  return student ? (
    <Dashboard theme={theme} setTheme={setTheme} />
  ) : (
    <LoginScreen theme={theme} setTheme={setTheme} />
  );
};

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <StudentProvider>
      <RefreshProvider>
        <AppContent theme={theme} setTheme={setTheme} />
      </RefreshProvider>
    </StudentProvider>
  );
}

export default App;
