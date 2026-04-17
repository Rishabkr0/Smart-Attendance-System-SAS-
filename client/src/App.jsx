import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import RegisterStudent from './pages/RegisterStudent';
import AttendanceRecords from './pages/AttendanceRecords';
import SelfEnrollment from './pages/SelfEnrollment';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/self-enrollment" element={<SelfEnrollment />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="scanner" element={<Scanner />} />
          <Route path="register-student" element={<RegisterStudent />} />
          <Route path="records" element={<AttendanceRecords />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
