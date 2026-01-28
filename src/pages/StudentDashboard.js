import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentContext from '../context/StudentContext';
import RequestsContext from '../context/RequestsContext';
import NotificationBell from '../components/NotificationBell';
import '../App.css';

export default function StudentDashboard() {
  const { currentStudent } = useContext(StudentContext);
  const { requests } = useContext(RequestsContext);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const studentRequests = requests.filter((r) => r.studentRoll === currentStudent.roll);

  const filteredRequests = useMemo(() => {
    return studentRequests.filter((req) => {
      if (filterStatus !== 'All' && req.status !== filterStatus) return false;
      if (filterType !== 'All' && req.type !== filterType) return false;
      if (filterDateFrom && new Date(req.date) < new Date(filterDateFrom)) return false;
      if (filterDateTo && new Date(req.date) > new Date(filterDateTo)) return false;
      return true;
    });
  }, [studentRequests, filterStatus, filterType, filterDateFrom, filterDateTo]);

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Welcome{currentStudent ? `, ${currentStudent.name}` : ''}!</h2>
          <span className="role-badge">Student</span>
        </div>
        <NotificationBell recipient={currentStudent.roll} />
      </div>
      <div className="dashboard-card">
        <p>You're logged in as {currentStudent ? currentStudent.roll : 'a student'}.</p>
        <button className="new-request-btn" onClick={() => navigate('/student-request')}>
          New Request
        </button>

        {studentRequests.length > 0 && (
          <div className="requests-section">
            <h3>Your Requests</h3>
            
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
                    </div>
                    <p><strong>Reason:</strong> {req.description}</p>
                    <p><strong>Time:</strong> {req.time}</p>
                    <p><strong>Place:</strong> {req.place}</p>
                    {req.duration && <p><strong>Duration:</strong> {req.duration} days</p>}
                    {req.fileName && <p><strong>📎 File:</strong> {req.fileName}</p>}
                    {req.approvedBy && <p><strong>Approved/Rejected by:</strong> {req.approvedBy}</p>}
                  </div>
                ))
              ) : (
                <p>No requests match the selected filters.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
