import { useState } from "react";
import axios from "axios";
import "../css/Register.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/register",
        { name, email, password }
      );

      setMessage(res.data.message);

      // ✅ Redirect to OTP page and pass email
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1500);

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <h3>Create Account</h3>
          <p>Start your learning journey with us</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="form-control"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="signup-link">
            Sign in
          </Link>
        </p>

        {/* Message */}
        {message && (
          <p className="text-center mt-3 text-danger">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default Register;
