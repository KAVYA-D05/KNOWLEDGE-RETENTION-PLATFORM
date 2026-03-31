import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation for active states
import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // To highlight the current page
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${API}/auth/logout`, { withCredentials: true });
    } catch {}
    localStorage.clear();
    navigate("/login");
  };

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h3 className="navbar-logo" onClick={() => navigate("/home")}>
            Knowledge<span>Retention</span>
          </h3>
          {username && <span className="navbar-user">Hi, {username}</span>}
        </div>

        <ul className="navbar-links">
          <li className={isActive("/home")} onClick={() => navigate("/home")}>Home</li>
          <li className={isActive("/quiz")} onClick={() => navigate("/quiz")}>Quiz</li>
          <li className={isActive("/notes")} onClick={() => navigate("/notes")}>Notes</li>
          <li className={isActive("/dashboard")} onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li className={isActive("/profile")} onClick={() => navigate("/profile")}>Profile</li>
        </ul>

        <div className="navbar-right">
          <button className="navbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;