import React, { createContext, useState, useContext } from "react";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);

  const login = (studentData) => {
    setStudent(studentData);
  };

  const logout = () => {
    setStudent(null);
  };

  const isAdmin = student?.role === "Admin";
  const isStudent = student?.role === "Student";
  const hasRole = (...roles) => roles.includes(student?.role);

  return (
    <StudentContext.Provider
      value={{ student, login, logout, isAdmin, isStudent, hasRole }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
