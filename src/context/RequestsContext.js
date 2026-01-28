import React, { createContext, useEffect, useState } from 'react';

const RequestsContext = createContext();

export function RequestsProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    try {
      const raw = localStorage.getItem('requests');
      const parsed = raw ? JSON.parse(raw) : [];
      // Ensure all requests have status fields
      return parsed.map(req => ({
        status: 'Pending',
        approvedBy: null,
        isFinal: false,
        ...req
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('requests', JSON.stringify(requests));
    } catch (e) {}
  }, [requests]);

  function submitRequest(requestData) {
    const req = {
      id: Date.now(),
      ...requestData,
      status: 'Pending',
      approvedBy: null,
      isFinal: false,
      submittedAt: new Date().toISOString(),
    };
    setRequests((prev) => [...prev, req]);
    return { ok: true, request: req };
  }

  function updateRequestStatus(id, status, approvedBy, isFinal = false) {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status, approvedBy, isFinal } : req
      )
    );
  }

  function getRequestsForRole(role) {
    if (role === 'Advisor' || role === 'HOD') {
      return requests;
    } else if (role === 'Principal') {
      return requests.filter((r) => r.forwardedToPrincipal);
    }
    return [];
  }

  return (
    <RequestsContext.Provider value={{ requests, submitRequest, getRequestsForRole, updateRequestStatus }}>
      {children}
    </RequestsContext.Provider>
  );
}

export default RequestsContext;