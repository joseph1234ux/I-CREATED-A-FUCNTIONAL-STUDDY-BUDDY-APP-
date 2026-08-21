import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Poems from './pages/Poems';
import Library from './pages/Library';
import Store from './pages/Store';
import StoryDetail from './pages/StoryDetail';
import Reader from './pages/Reader';  // ← Make sure this is imported
import AddStory from './pages/AddStory';
import EditStory from './pages/EditStory';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import Search from './pages/Search';
import AdminStudio from './pages/AdminStudio';

function App() {
  return (
    <div className="app">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/poems" element={<Poems />} />
          <Route path="/library" element={<Library />} />
          <Route path="/store" element={<Store />} />
          <Route path="/search" element={<Search />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          
          {/* ⚠️ READER ROUTES - MUST BE HERE ⚠️ */}
          <Route path="/reader/:id" element={<Reader />} />
          <Route path="/reader/:id/:chapterId" element={<Reader />} />
          
          {/* Story Management */}
          <Route path="/add-story" element={<AddStory />} />
          <Route path="/edit-story/:id" element={<EditStory />} />
          
          {/* Info Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Pages */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin Pages */}
          <Route path="/admin" element={<AdminStudio />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
