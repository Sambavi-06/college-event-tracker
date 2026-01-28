import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentContext from '../context/StudentContext';
import RequestsContext from '../context/RequestsContext';
import NotificationsContext from '../context/NotificationsContext';
import '../App.css';

function generateAISummary(reason, type, duration) {
  const reasonLower = reason.toLowerCase();
  let summary = '';
  
  if (type === 'Leave') {
    summary = `${duration}-day leave request. Reason: ${reason.substring(0, 50)}...`;
  } else {
    summary = `On-duty request. Reason: ${reason.substring(0, 60)}...`;
  }
  
  return summary;
}

function generateAIPriority(type, duration) {
  if (type === 'Leave' && duration > 2) return 'High';
  if (type === 'Leave') return 'Medium';
  return 'Low';
}

export default function StudentRequest() {
  const { currentStudent } = useContext(StudentContext);
  const { submitRequest } = useContext(RequestsContext);
  const { addNotification } = useContext(NotificationsContext);
  const navigate = useNavigate();
  const [type, setType] = useState('OD');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [duration, setDuration] = useState(1);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!description.trim() || !date || !time || !place.trim()) {
      setError('All fields are required');
      return;
    }

    if (type === 'Leave' && duration <= 0) {
      setError('Duration must be greater than 0 for leave');
      return;
    }

    const forwardedToPrincipal = type === 'Leave' && duration > 2;
    const aiSummary = generateAISummary(description, type, duration);
    const aiPriority = generateAIPriority(type, duration);

    const res = submitRequest({
      studentRoll: currentStudent.roll,
      studentName: currentStudent.name,
      type,
      description: description.trim(),
      date,
      time,
      place: place.trim(),
      duration: type === 'Leave' ? duration : null,
      fileName: file ? file.name : null,
      forwardedToPrincipal,
      aiSummary,
      aiPriority,
    });

    if (res.ok) {
      addNotification(`Your ${type} request has been submitted.`, 'info', currentStudent.roll);
      navigate('/student-dashboard');
    } else {
      setError(res.error || 'Failed to submit request');
    }
  }

  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h2>New Request</h2>
        <form className="simple-form" onSubmit={handleSubmit}>
          <label>Request Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="OD">OD (On Duty)</option>
              <option value="Leave">Leave</option>
            </select>
          </label>

          <label>Description / Reason
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description or reason"
              rows={3}
              required
            />
          </label>

          <label>Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <label>Time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>

          <label>Place
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Enter location"
              required
            />
          </label>

          {type === 'Leave' && (
            <label>Duration (days)
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                required
              />
            </label>
          )}

          <label>Attachment (Optional)
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && <p style={{ fontSize: '0.9rem', color: '#59627a', marginTop: 4 }}>📎 {file.name}</p>}
          </label>

          {error && <div className="form-error">{error}</div>}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
            <button className="role-button" type="submit">Submit Request</button>
            <button
              className="role-button"
              type="button"
              onClick={() => navigate('/student-dashboard')}
              style={{ background: '#6c757d' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
