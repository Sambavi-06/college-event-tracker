import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-page">
      <div className="role-card">
        <h1 className="role-title">Select Your Role</h1>
        <p className="role-sub">Choose one to continue</p>
        <div className="role-buttons">
          <button className="role-button" onClick={() => navigate('/student-login')}>Student</button>
          <button className="role-button" onClick={() => navigate('/staff-login?role=Advisor')}>Advisor</button>
          <button className="role-button" onClick={() => navigate('/staff-login?role=HOD')}>HOD</button>
          <button className="role-button" onClick={() => navigate('/staff-login?role=Principal')}>Principal</button>
        </div>
      </div>
    </div>
  );
}
