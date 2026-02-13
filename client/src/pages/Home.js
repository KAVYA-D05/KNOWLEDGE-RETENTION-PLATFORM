import Navbar from "../components/Navbar";
import "../css/Home.css";

function Home() {
  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email");

  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="home-content">
        {/* Welcome Card */}
        <section className="welcome-card">
          <h3>Welcome, {username} 👋</h3>
          <p>
            This is your dashboard for the Knowledge Retention Platform. From
            here, you can manage notes, attempt quizzes, and track your learning
            progress efficiently.
          </p>

          {email && (
            <p className="user-email">
              <strong>Logged in as:</strong> {email}
            </p>
          )}
        </section>

        {/* About Platform */}
        <section className="info-card">
          <h3>About the Knowledge Retention Platform</h3>

          <p>
            The Knowledge Retention Platform is designed to support long-term
            learning by combining structured content, active revision, and
            continuous assessment. It helps learners store, recall, and apply
            knowledge effectively over time.
          </p>

          <p>
            By integrating notes, quizzes, and progress tracking, the platform
            minimizes knowledge loss and encourages consistent learning habits.
            It is suitable for students, educators, and professionals seeking a
            reliable learning support system.
          </p>
        </section>

        {/* Feature Cards */}
        <section className="features">
          <div className="feature-card">
            <h4>📊 Dashboard</h4>
            <p>
              View an overview of your learning activities and access all
              modules from a single interface.
            </p>
          </div>

          <div className="feature-card">
            <h4>📝 Notes</h4>
            <p>
              Read structured topic notes, add your own content, and share notes
              using generated links.
            </p>
          </div>

          <div className="feature-card">
            <h4>🧠 Quiz</h4>
            <p>
              Test your understanding through quizzes designed to reinforce
              memory and improve recall.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 Knowledge Retention Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
