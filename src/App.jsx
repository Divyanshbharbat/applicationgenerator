import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import HealthIssueForm from "./pages/HealthIssueForm";
// import EventParticipationForm from "./pages/EventParticipationForm";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Home from "./Components/Home";
import HealthIssueForm from "./Components/HealthIssueForm";
import EventParticipationForm from "./Components/EventParticipationForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/health-issue" element={<HealthIssueForm />} />
        <Route path="/event-form" element={<EventParticipationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
