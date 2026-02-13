import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Profile.css";

function Profile() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [updated, setUpdated] = useState(false);

  /* Load email from localStorage */
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  /* Fetch profile when email changes */
  useEffect(() => {
    if (!email) return;

    axios
      .get(`http://localhost:5000/api/profile/${email}`)
      .then((res) => {
        setName(res.data.name || "");
        setPhone(res.data.phone || "");
      })
      .catch((err) => {
        console.log("Fetch error:", err);
      });

  }, [email]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/profile/${email}`,
        { name, phone }
      );

      // Update navbar name
      localStorage.setItem("username", res.data.user.name);

      setUpdated(true);

    } catch (error) {
      console.log(error);
      alert("Profile update failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">

          <div className="profile-left">
            <div className="profile-placeholder">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
            <h3>{name}</h3>
            <p>{email}</p>
          </div>

          <div className="profile-right">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setUpdated(false);
              }}
            />

            <label>Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setUpdated(false);
              }}
            />

            {!updated ? (
              <button onClick={handleUpdate}>
                Update Profile
              </button>
            ) : (
              <p className="success-msg">
                Profile Updated Successfully ✅
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
