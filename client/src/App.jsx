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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookieConsent from './components/CookieConsent';
import ContactSupport from './pages/ContactSupport';
import BugReport from './pages/BugReport';

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
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="contact-support" element={<ContactSupport />} />
          <Route path="bug-report" element={<BugReport />} />
        </Route>
      </Routes>
      <CookieConsent />
    </Router>
  );
}

export default App;
