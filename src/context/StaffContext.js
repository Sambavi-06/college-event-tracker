import React, { createContext, useEffect, useState } from 'react';

const StaffContext = createContext();

export function StaffProvider({ children }) {
  const [currentStaff, setCurrentStaff] = useState(() => {
    try {
      const raw = localStorage.getItem('currentStaff');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentStaff) localStorage.setItem('currentStaff', JSON.stringify(currentStaff));
      else localStorage.removeItem('currentStaff');
    } catch (e) {}
  }, [currentStaff]);

  function loginStaff(role, password) {
    // Simple validation: password 'admin' for all
    if (password === 'admin') {
      setCurrentStaff({ role });
      return { ok: true };
    }
    return { ok: false, error: 'Invalid password' };
  }

  function logoutStaff() {
    setCurrentStaff(null);
  }

  return (
    <StaffContext.Provider value={{ currentStaff, loginStaff, logoutStaff }}>
      {children}
    </StaffContext.Provider>
  );
}

export default StaffContext;