import React, { useContext, useState, useMemo } from 'react';
import StaffContext from '../context/StaffContext';
import RequestsContext from '../context/RequestsContext';
import NotificationsContext from '../context/NotificationsContext';
import AttendanceContext from '../context/AttendanceContext';
import NotificationBell from '../components/NotificationBell';
import '../App.css';

export default function StaffDashboard() {
  const { currentStaff } = useContext(StaffContext);
  const { getRequestsForRole, updateRequestStatus } = useContext(RequestsContext);
  const { addNotification } = useContext(NotificationsContext);
  const { markAttendance, getAttendance, isAttendanceMarked } = useContext(AttendanceContext);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const isStaffRole = currentStaff?.role === 'Staff';
  const requests = isStaffRole ? [] : getRequestsForRole(currentStaff?.role);

  // For Staff: get ALL approved requests from any student
  const approvedRequests = useMemo(() => {
    if (!isStaffRole) return [];
    // Get all requests from RequestsContext and filter for approved ones
    try {
      const raw = localStorage.getItem('requests');
      const allRequests = raw ? JSON.parse(raw) : [];
      return allRequests.filter((r) => r.status === 'Approved');
    } catch {
      return [];
    }
  }, [isStaffRole]);

  const requestsToDisplay = isStaffRole ? approvedRequests : requests;

  const filteredRequests = useMemo(() => {
    return requestsToDisplay.filter((req) => {
      if (filterStatus !== 'All' && req.status !== filterStatus) return false;
      if (filterType !== 'All' && req.type !== filterType) return false;
      if (filterDateFrom && new Date(req.date) < new Date(filterDateFrom)) return false;
      if (filterDateTo && new Date(req.date) > new Date(filterDateTo)) return false;
      return true;
    });
  }, [requestsToDisplay, filterStatus, filterType, filterDateFrom, filterDateTo]);

  function handleApprove(req) {
    const isFinal = currentStaff.role === 'Principal';
    updateRequestStatus(req.id, 'Approved', currentStaff.role, isFinal);
    addNotification(
      `Your ${req.type} request was approved by ${currentStaff.role}.`,
      'success',
      req.studentRoll
    );
  }

  function handleReject(req) {
    const confirmed = window.confirm(`Are you sure you want to reject this ${req.type} request?`);
    if (!confirmed) return;
    
    const isFinal = currentStaff.role === 'Principal';
    updateRequestStatus(req.id, 'Rejected', currentStaff.role, isFinal);
    addNotification(
      `Your ${req.type} request was rejected by ${currentStaff.role}.`,
      'error',
      req.studentRoll
    );
  }

  function handleMarkAttendance(req, status) {
    markAttendance(req.id, status);
  }

  // Render Staff Dashboard
  if (isStaffRole) {
    return (
      <div className="student-dashboard">
        <div className="dashboard-header">
          <div>
            <h2>Welcome, {currentStaff?.name || 'Staff'}!</h2>
            <span className="role-badge">Staff</span>
          </div>
          <NotificationBell recipient={currentStaff?.name} />
        </div>
        <div className="dashboard-card">
          <p>Manage attendance for approved student requests.</p>

          {approvedRequests.length > 0 ? (
            <div className="requests-section">
              <h3>Approved Requests</h3>

              <div className="filter-section">
                <label>Type
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="All">All</option>
                    <option value="OD">OD</option>
                    <option value="Leave">Leave</option>
                  </select>
                </label>
                <label>From Date
                  <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
                </label>
                <label>To Date
                  <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
                </label>
              </div>

              <div className="requests-list">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => {
                    const attendance = getAttendance(req.id);
                    const isMarked = isAttendanceMarked(req.id);
                    return (
                      <div key={req.id} className="request-card">
                        <div className="request-header">
                          <span className="request-type">{req.type}</span>
                          <span className="request-date">{new Date(req.date).toLocaleDateString()}</span>
                          <span className={`request-status ${req.status.toLowerCase()}`}>{req.status}</span>
                        </div>
                        <p><strong>Student:</strong> {req.studentName} ({req.studentRoll})</p>
                        <p><strong>Reason:</strong> {req.description}</p>
                        <p><strong>Date:</strong> {new Date(req.date).toLocaleDateString()}</p>
                        {req.time && <p><strong>Time:</strong> {req.time}</p>}
                        {req.place && <p><strong>Place:</strong> {req.place}</p>}
                        {req.duration && <p><strong>Duration:</strong> {req.duration} days</p>}
                        <p><strong>Approved By:</strong> {req.approvedBy}</p>
                        
                        <div className="attendance-section">
                          {isMarked ? (
                            <p className="attendance-marked">
                              <span className={`attendance-badge ${attendance.status.toLowerCase()}`}>
                                {attendance.status === 'Present' ? '✓' : '✗'} {attendance.status}
                              </span>
                            </p>
                          ) : (
                            <div className="action-buttons">
                              <button
                                className="present-btn"
                                onClick={() => handleMarkAttendance(req, 'Present')}
                              >
                                Mark Present
                              </button>
                              <button
                                className="absent-btn"
                                onClick={() => handleMarkAttendance(req, 'Absent')}
                              >
                                Mark Absent
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No approved requests match the selected filters.</p>
                )}
              </div>
            </div>
          ) : (
            <p>No approved requests to display.</p>
          )}
        </div>
      </div>
    );
  }

  // Render Advisor/HOD/Principal Dashboard (original view)
  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Welcome, {currentStaff?.role}!</h2>
          <span className="role-badge">{currentStaff?.role}</span>
        </div>
        <NotificationBell recipient={currentStaff?.role} />
      </div>
      <div className="dashboard-card">
        <p>You can view and approve/reject the following requests.</p>

        {requests.length > 0 ? (
          <div className="requests-section">
            <h3>Requests</h3>

            <div className="filter-section">
              <label>Status
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>
              <label>Type
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="All">All</option>
                  <option value="OD">OD</option>
                  <option value="Leave">Leave</option>
                </select>
              </label>
              <label>From Date
                <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
              </label>
              <label>To Date
                <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
              </label>
            </div>

            <div className="requests-list">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <div key={req.id} className="request-card">
                    <div className="request-header">
                      <span className="request-type">{req.type}</span>
                      <span className="request-date">{new Date(req.date).toLocaleDateString()}</span>
                      <span className={`request-status ${req.status.toLowerCase()}`}>{req.status}</span>
                      {req.aiPriority && <span className={`ai-priority priority-${req.aiPriority.toLowerCase()}`}>{req.aiPriority}</span>}
                    </div>
                    <p><strong>Student:</strong> {req.studentName} ({req.studentRoll})</p>
                    {req.aiSummary && <p><strong>AI Summary:</strong> {req.aiSummary}</p>}
                    <p><strong>Reason:</strong> {req.description}</p>
                    <p><strong>Time:</strong> {req.time}</p>
                    <p><strong>Place:</strong> {req.place}</p>
                    {req.duration && <p><strong>Duration:</strong> {req.duration} days</p>}
                    {req.fileName && <p><strong>📎 File:</strong> {req.fileName}</p>}
                    {req.approvedBy && <p><strong>Approved/Rejected by:</strong> {req.approvedBy}</p>}
                    {!req.isFinal && (
                      <div className="action-buttons">
                        <button className="approve-btn" onClick={() => handleApprove(req)}>Approve</button>
                        <button className="reject-btn" onClick={() => handleReject(req)}>Reject</button>
                      </div>
                    )}
                    {req.isFinal && <p className="final-decision">✓ Final decision made by {req.approvedBy}</p>}
                  </div>
                ))
              ) : (
                <p>No requests match the selected filters.</p>
              )}
            </div>
          </div>
        ) : (
          <p>No requests to display.</p>
        )}
      </div>
    </div>
  );
}