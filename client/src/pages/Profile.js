import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Profile.css";

function Profile() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [stats, setStats] = useState({ notes: 0, quizzes: 0 });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("username");
    if (storedEmail) setEmail(storedEmail);
    if (storedName) setName(storedName);
  }, []);

  useEffect(() => {
    if (!email) return;

    // Fetch Analytics for the sidebar and main view
    const fetchStats = async () => {
      try {
        const notesRes = await axios.get(`${API}/api/notes/my/${email}`);
        const quizRes = await axios.get(`${API}/api/quizzes/attempts/${email}`);
        setStats({ notes: notesRes.data.length, quizzes: quizRes.data.length });
      } catch (e) {
        console.log("Stats fetch failed");
      }
    };
    fetchStats();
  }, [email]);

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">
          
          {/* LEFT SIDE: PERSONAL IDENTITY */}
          <div className="profile-left">
            <div className="avatar-section">
              <div className="profile-placeholder">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="status-badge">Verified Member</div>
            </div>
            
            <div className="user-info-brief">
              <h3>{name || "User"}</h3>
              <p>{email}</p>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-num">{stats.notes}</span>
                <span className="stat-label">Notes</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{stats.quizzes}</span>
                <span className="stat-label">Quizzes</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: VIEW-ONLY ACCOUNT DETAILS */}
          <div className="profile-right">
            <div className="form-header">
              <h2>Profile Overview</h2>
              <p>Basic account information and system credentials.</p>
            </div>

            <div className="detail-group">
              <label>Full Name</label>
              <div className="static-value">{name || "Not Set"}</div>
            </div>

            <div className="detail-group">
              <label>Registered Email</label>
              <div className="static-value">{email}</div>
            </div>

            <div className="detail-group">
               <label>Account Security</label>
               <div className="security-info-box">
                  <div className="security-item">
                    <strong>Account Status:</strong> <span>Active</span>
                  </div>
                  <div className="security-item">
                    <strong>Access Level:</strong> <span className="highlight">Standard User</span>
                  </div>
                  <div className="security-item">
                    <strong>Login Method:</strong> <span>Email / Password</span>
                  </div>
               </div>
            </div>

            <div className="footer-note">
              <p>Contact your administrator to request changes to your primary account details.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;