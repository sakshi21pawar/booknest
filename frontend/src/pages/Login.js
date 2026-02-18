import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaBook } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setUser(JSON.parse(storedUser));
          navigate("/books");
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/books");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon"><FaBook /></div>
          <h1>Book<span>Nest</span></h1>
          <p>Your literary journey starts here</p>
        </div>

        {user ? (
          <div className="loggedin-card">
            <h2>Welcome back, {user.name}!</h2>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account to continue</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
              </div>

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="login-footer">
              Don't have an account? <Link to="/signup">Create one here</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;