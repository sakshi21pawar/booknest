import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaBook, FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/register',
        { name: formData.name, email: formData.email, password: formData.password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Backend response:', response.data);
      setSuccess(true);
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">

        {/* Brand */}
        <div className="signup-brand">
          <div className="signup-brand-icon"><FaBook /></div>
          <h2>Book<span>Nest</span></h2>
        </div>

        <h1>Create Account</h1>
        <p className="signup-subtitle">Join our community of book lovers today</p>

        {/* Success */}
        {success && (
          <div className="success-message">
            ✓ Account created successfully!<br />Redirecting to login...
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="signup-form">

            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="signup-btn" disabled={loading}>
              <FaUserPlus />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="signup-divider">or</div>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;