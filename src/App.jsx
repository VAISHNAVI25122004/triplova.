
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import Destinations from './pages/Destinations';
import ContinentDetail from './pages/ContinentDetail';
import CategoryDetail from './pages/CategoryDetail';
import SubCategoryDetail from './pages/SubCategoryDetail';
import ChildCategoryPackages from './pages/ChildCategoryPackages';

import Premium from './pages/Premium';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import About from './pages/About';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import PlaceholderPage from './pages/PlaceholderPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:continentName" element={<ContinentDetail />} />
            <Route path="/destinations/:continentName/:categoryName" element={<CategoryDetail />} />
            <Route path="/destinations/:continentName/:categoryName/:subCategoryName" element={<SubCategoryDetail />} />
            <Route path="/destinations/:continentName/:categoryName/:subCategoryName/:childCategoryName" element={<ChildCategoryPackages />} />

            <Route path="/premium" element={<Premium />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Placeholder Routes */}
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faqs" element={<PlaceholderPage title="Frequently Asked Questions" />} />
            <Route path="/privacy-policy" element={<PlaceholderPage title="Privacy Policy" />} />
            <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
            <Route path="/sitemap" element={<PlaceholderPage title="Sitemap" />} />

            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/admin-login" element={<AdminLogin />} />

            <Route
              path="/admin-panel"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
