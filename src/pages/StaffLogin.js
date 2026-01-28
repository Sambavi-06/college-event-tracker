import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StaffContext from '../context/StaffContext';
import '../App.css';

export default function StaffLogin() {
  const { loginStaff } = useContext(StaffContext);
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'Advisor';
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!['Advisor', 'HOD', 'Principal'].includes(role)) {
      navigate('/');
    }
  }, [role, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const res = loginStaff(role, password);
    if (res.ok) {
      navigate('/staff-dashboard');
    } else {
      setError(res.error || 'Login failed');
    }
  }

  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h2>{role} Login</h2>
        <form className="simple-form" onSubmit={handleSubmit}>
          <label>Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="role-button" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
