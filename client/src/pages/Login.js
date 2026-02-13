import { useState } from "react";
import axios from "axios";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../images/google_icon.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  /* ================= NORMAL LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        { email, password }
      );

      // ✅ Save login state
      localStorage.clear();  // 🔥 VERY IMPORTANT

localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("email", res.data.user.email);
localStorage.setItem("username", res.data.user.name);


      // ✅ Redirect to Home
      navigate("/home");

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Login failed. Try again."
      );
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <h3>Welcome Back</h3>
          <p>Please sign in to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100 mb-3">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="separator">
          <span>or</span>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleGoogleLogin}
        >
          <img
            src={googleIcon}
            alt="Google"
            style={{ width: "18px" }}
          />
          Sign in with Google
        </button>

        {/* Footer */}
        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="signup-link">
            Create an account
          </Link>
        </p>

        {/* Error Message */}
        {message && (
          <p className="text-center mt-3 text-danger">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
