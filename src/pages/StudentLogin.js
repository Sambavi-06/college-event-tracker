import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentContext from '../context/StudentContext';
import '../App.css';

export default function StudentLogin() {
  const { loginStudent } = useContext(StudentContext);
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const res = loginStudent(roll.trim(), password);
    if (res.ok) navigate('/student-dashboard');
    else setError(res.error || 'Login failed');
  }

  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h2>Student Login</h2>
        <form className="simple-form" onSubmit={handleSubmit}>
          <label>Roll Number
            <input value={roll} onChange={(e) => setRoll(e.target.value)} required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="role-button" type="submit">Login</button>
          </div>
        </form>
        <p style={{ marginTop: 12 }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/student-register')}
            style={{ background: 'transparent', border: 'none', color: '#2d8cff', fontWeight: 600, cursor: 'pointer' }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
