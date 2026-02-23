import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/TopicDetails.css";

const topicData = {
  1: {
    title: "Introduction to Knowledge Retention",
    introduction:
      "Knowledge retention refers to the ability to remember and apply learned information over a long period of time.",
    information:
      "In modern education and professional environments, learners are exposed to large volumes of information. Without structured retention strategies, most information is forgotten quickly. Knowledge retention focuses on reinforcing memory through repetition, understanding, and practical application. Digital platforms support this by organizing content, enabling revision, and tracking progress.",
    outcome:
      "Students will understand the importance of knowledge retention and its role in long-term learning."
  },
  2: {
    title: "Learning Theories",
    introduction:
      "Learning theories explain how individuals acquire and retain knowledge.",
    information:
      "Major learning theories include behaviorism, cognitivism, and constructivism. Each theory provides insight into how learning occurs and how instruction can be designed effectively.",
    outcome:
      "Learners will be able to analyze and apply learning theories appropriately."
  }
  // 👉 You can continue adding up to 30 topics here
};

function TopicDetails() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const topic = topicData[topicId];

  if (!topic) {
    return <p style={{ padding: "30px" }}>Topic not found</p>;
  }

  return (
    <div className="topic-details-container">
      <Navbar />

      <main className="topic-details-content">
        <button className="back-btn" onClick={() => navigate("/notes")}>
          ← Back to Topics
        </button>

        <div className="topic-details-card">
          <h2>{topic.title}</h2>

          <p><strong>Introduction:</strong> {topic.introduction}</p>
          <p><strong>Information:</strong> {topic.information}</p>
          <p><strong>Learning Outcome:</strong> {topic.outcome}</p>
        </div>
      </main>
    </div>
  );
}

export default TopicDetails;
