import React, { createContext, useEffect, useState } from 'react';

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const [attendance, setAttendance] = useState(() => {
    try {
      const raw = localStorage.getItem('attendance');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('attendance', JSON.stringify(attendance));
    } catch (e) {}
  }, [attendance]);

  function markAttendance(requestId, status) {
    // status should be 'Present' or 'Absent'
    setAttendance((prev) => ({
      ...prev,
      [requestId]: {
        status,
        markedAt: new Date().toISOString()
      }
    }));
    return { ok: true };
  }

  function getAttendance(requestId) {
    return attendance[requestId] || null;
  }

  function isAttendanceMarked(requestId) {
    return !!attendance[requestId];
  }

  return (
    <AttendanceContext.Provider value={{ markAttendance, getAttendance, isAttendanceMarked, attendance }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export default AttendanceContext;
