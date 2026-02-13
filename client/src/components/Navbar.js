import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  /* Load username when component mounts */
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleLogout = async () => {
  try {
    await axios.get("http://localhost:5000/auth/logout", {
      withCredentials: true,
    });
  } catch {}

  localStorage.clear();
  navigate("/login");
};


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3
          className="navbar-logo"
          onClick={() => navigate("/home")}
        >
          Knowledge Retention
        </h3>

        {username && (
          <span className="navbar-user">
            Welcome, {username}
          </span>
        )}
      </div>

      <ul className="navbar-links">
        <ul className="navbar-links">
  <li onClick={() => navigate("/home")}>Home</li>
  <li onClick={() => navigate("/quiz")}>Quiz</li>
  <li onClick={() => navigate("/notes")}>Notes</li>
  <li onClick={() => navigate("/dashboard")}>Dashboard</li>
  <li onClick={() => navigate("/profile")}>Profile</li>
</ul>

      </ul>

      <div className="navbar-right">
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
