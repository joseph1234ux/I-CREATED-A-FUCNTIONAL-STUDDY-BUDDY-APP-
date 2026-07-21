import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AddCourse from './pages/AddCourse';
import EditCourse from './pages/EditCourse';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AITutor from './pages/AITutor';
import Notes from './pages/Notes';
import JAMBPrep from './pages/JAMBPrep';
import FocusMode from './pages/FocusMode';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import PaymentSuccess from './pages/PaymentSuccess';


function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Course Management */}
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/edit-course/:id" element={<EditCourse />} />
        
        {/* Study Features */}
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/jamb" element={<JAMBPrep />} />
        <Route path="/focus" element={<FocusMode />} />
        
        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} /> {/* ✅ MOVED HERE */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
