import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentContext from '../context/StudentContext';
import '../App.css';

export default function StudentRegister() {
  const { registerAndLogin } = useContext(StudentContext);
  const [roll, setRoll] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const res = registerAndLogin({ roll: roll.trim(), name: name.trim(), password });
    if (res.ok) {
      navigate('/student-dashboard');
    } else {
      setError(res.error || 'Unable to register');
    }
  }

  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h2>Student Registration</h2>
        <form className="simple-form" onSubmit={handleSubmit}>
          <label>Roll Number
            <input value={roll} onChange={(e) => setRoll(e.target.value)} required />
          </label>
          <label>Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="role-button" type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}
