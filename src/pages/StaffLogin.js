import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StaffContext from '../context/StaffContext';
import '../App.css';

export default function StaffLogin() {
  const { loginStaff, createStaffAccount } = useContext(StaffContext);
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'Advisor';
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!['Staff', 'Advisor', 'HOD', 'Principal'].includes(role)) {
      navigate('/');
    }
  }, [role, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    
    if (role === 'Staff') {
      if (isCreating) {
        // Create account for Staff
        if (!name.trim() || !password.trim()) {
          setError('Name and password are required');
          return;
        }
        const res = createStaffAccount(name.trim(), password);
        if (res.ok) {
          navigate('/staff-dashboard');
        } else {
          setError(res.error || 'Account creation failed');
        }
      } else {
        // Login for Staff
        if (!name.trim() || !password.trim()) {
          setError('Name and password are required');
          return;
        }
        const res = loginStaff(name.trim(), password, role);
        if (res.ok) {
          navigate('/staff-dashboard');
        } else {
          setError(res.error || 'Login failed');
        }
      }
    } else {
      // Advisor, HOD, Principal - password only
      const res = loginStaff(role, password);
      if (res.ok) {
        navigate('/staff-dashboard');
      } else {
        setError(res.error || 'Login failed');
      }
    }
  }

  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h2>{role} {isCreating && role === 'Staff' ? 'Account Creation' : 'Login'}</h2>
        <form className="simple-form" onSubmit={handleSubmit}>
          {role === 'Staff' && (
            <label>Name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
          )}
          <label>Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="role-button" type="submit">
              {isCreating ? 'Create Account' : 'Login'}
            </button>
          </div>
        </form>
        {role === 'Staff' && (
          <p style={{ marginTop: 12 }}>
            {isCreating ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsCreating(!isCreating);
                setError(null);
                setName('');
                setPassword('');
              }}
              style={{ background: 'transparent', border: 'none', color: '#2d8cff', fontWeight: 600, cursor: 'pointer' }}
            >
              {isCreating ? 'Login' : 'Create Account'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
