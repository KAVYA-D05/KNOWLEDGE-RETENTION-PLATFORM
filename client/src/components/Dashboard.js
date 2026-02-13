import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/Dashboard.css";

function Dashboard() {
  const [attempts, setAttempts] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const email = localStorage.getItem("email");

  /* ================= FETCH ATTEMPTS ================= */
  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizzes/attempts/${email}`
      );
      setAttempts(res.data);
    } catch (err) {
      console.error("Failed to fetch attempts");
    }
  };

  /* ================= CLOSE MENU WHEN CLICK OUTSIDE ================= */
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, []);

  /* ================= DELETE ATTEMPT ================= */
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/quizzes/attempt/${id}`
      );

      fetchAttempts();
    } catch (err) {
      console.error("Delete failed");
    }
  };

  /* ================= VIEW DETAILS ================= */
  const handleView = (attempt) => {
    setSelectedAttempt(attempt);
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        <h2>Your Quiz Attempts</h2>

        {attempts.length === 0 ? (
          <p>No quiz attempts yet.</p>
        ) : (
          <table className="attempt-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Score</th>
                <th>Total</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt._id}>
                  <td>{attempt.topic || "N/A"}</td>
                  <td>{attempt.score}</td>
                  <td>{attempt.total}</td>
                  <td>
                    {new Date(
                      attempt.attemptedAt
                    ).toLocaleString()}
                  </td>

                  {/* THREE DOT */}
                  <td>
                    <div className="menu-wrapper">
                      <button
                        className="three-dot"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(
                            activeMenu === attempt._id
                              ? null
                              : attempt._id
                          );
                        }}
                      >
                        ⋮
                      </button>

                      {activeMenu === attempt._id && (
                        <div
                          className="dropdown-menu-fixed"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >
                          <div
                            onClick={() =>
                              handleView(attempt)
                            }
                          >
                            View Details
                          </div>

                          <div
                            className="delete"
                            onClick={() =>
                              handleDelete(
                                attempt._id
                              )
                            }
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedAttempt && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedAttempt(null)
          }
        >
          <div
            className="modal-box"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h3>Quiz Details</h3>

            <p>
              <strong>Topic:</strong>{" "}
              {selectedAttempt.topic}
            </p>

            <p>
              <strong>Score:</strong>{" "}
              {selectedAttempt.score} /{" "}
              {selectedAttempt.total}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                selectedAttempt.attemptedAt
              ).toLocaleString()}
            </p>

            <button
              onClick={() =>
                setSelectedAttempt(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
