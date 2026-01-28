import React, { createContext, useEffect, useState } from 'react';

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(() => {
    try {
      const raw = localStorage.getItem('students');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [currentStudent, setCurrentStudent] = useState(() => {
    try {
      const raw = localStorage.getItem('currentStudent');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('students', JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  useEffect(() => {
    try {
      if (currentStudent) localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
      else localStorage.removeItem('currentStudent');
    } catch (e) {}
  }, [currentStudent]);

  function registerAndLogin({ roll, name, password }) {
    const exists = students.some((s) => s.roll === roll);
    if (exists) return { ok: false, error: 'Roll number already registered' };
    const student = { roll, name, password };
    setStudents((prev) => [...prev, student]);
    setCurrentStudent(student);
    return { ok: true };
  }

  function loginStudent(roll, password) {
    const found = students.find((s) => s.roll === roll && s.password === password);
    if (found) {
      setCurrentStudent(found);
      return { ok: true };
    }
    return { ok: false, error: 'Invalid credentials' };
  }

  function logoutStudent() {
    setCurrentStudent(null);
  }

  return (
    <StudentContext.Provider value={{ students, currentStudent, registerAndLogin, loginStudent, logoutStudent }}>
      {children}
    </StudentContext.Provider>
  );
}

export default StudentContext;
