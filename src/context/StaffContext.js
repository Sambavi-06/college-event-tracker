import React, { createContext, useEffect, useState } from 'react';

const StaffContext = createContext();

export function StaffProvider({ children }) {
  const [staffAccounts, setStaffAccounts] = useState(() => {
    try {
      const raw = localStorage.getItem('staffAccounts');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

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
      localStorage.setItem('staffAccounts', JSON.stringify(staffAccounts));
    } catch (e) {}
  }, [staffAccounts]);

  useEffect(() => {
    try {
      if (currentStaff) localStorage.setItem('currentStaff', JSON.stringify(currentStaff));
      else localStorage.removeItem('currentStaff');
    } catch (e) {}
  }, [currentStaff]);

  function createStaffAccount(name, password) {
    const exists = staffAccounts.some((s) => s.name === name);
    if (exists) return { ok: false, error: 'Name already registered' };
    const staff = { name, password, role: 'Staff' };
    setStaffAccounts((prev) => [...prev, staff]);
    setCurrentStaff(staff);
    return { ok: true };
  }

  function loginStaff(nameOrRole, password, role) {
    // If role is 'Staff', nameOrRole is the staff name
    if (role === 'Staff') {
      const found = staffAccounts.find((s) => s.name === nameOrRole && s.password === password);
      if (found) {
        setCurrentStaff(found);
        return { ok: true };
      }
      return { ok: false, error: 'Invalid name or password' };
    }
    
    // For Advisor, HOD, Principal - password 'admin' for all
    if (password === 'admin') {
      setCurrentStaff({ role: nameOrRole });
      return { ok: true };
    }
    return { ok: false, error: 'Invalid password' };
  }

  function logoutStaff() {
    setCurrentStaff(null);
  }

  return (
    <StaffContext.Provider value={{ currentStaff, loginStaff, logoutStaff, createStaffAccount }}>
      {children}
    </StaffContext.Provider>
  );
}

export default StaffContext;