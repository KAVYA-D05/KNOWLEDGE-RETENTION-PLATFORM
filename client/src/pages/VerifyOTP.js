import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get email from Register page
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/verify-otp",
        { email, otp }
      );

      setMessage(res.data.message);

      // Redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setMessage(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h3>Email Verification</h3>
        <p>Enter the OTP sent to your email</p>

        <form onSubmit={handleVerifyOTP}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100">
            Verify OTP
          </button>
        </form>

        {message && (
          <p className="text-center mt-3 text-danger">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default VerifyOTP;
