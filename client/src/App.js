import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import GoogleSuccess from "./pages/GoogleSuccess";
import VerifyOTP from "./pages/VerifyOTP";
import Quiz from "./pages/Quiz";
import Dashboard from "./components/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import AttemptQuiz from "./pages/AttemptQuiz";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/quiz" element={<Quiz />} />
      <Route path="/create-quiz" element={<CreateQuiz />} />
      <Route path="/attempt-quiz/:id" element={<AttemptQuiz />} />


        {/* No protection for testing */}
        <Route path="/home" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
