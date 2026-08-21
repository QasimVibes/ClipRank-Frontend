import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import Submit from './pages/Submit';
import Processing from './pages/Processing';
import Gallery from './pages/Gallery';
import History from './pages/History';
import ConnectYouTube from './pages/ConnectYouTube';
import ConnectFacebook from './pages/ConnectFacebook';
import ConnectInstagram from './pages/ConnectInstagram';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import VideoCutter from './pages/VideoCutter';
import PrivacyPolicy from './pages/PrivacyPolicy';

// On the server (SSR), entry-server.jsx wraps App in a <StaticRouter>.
// On the client, entry-client.jsx wraps App in a <BrowserRouter>.
// App itself only renders <Routes> so it works in both environments.

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <Signup />
          </GuestRoute>
        }
      />

      {/* SSR-enabled public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* Protected client-side routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Submit />} />
        <Route path="/cutter" element={<VideoCutter />} />
        <Route path="/processing/:jobId" element={<Processing />} />
        <Route path="/gallery/:jobId" element={<Gallery />} />
        <Route path="/history" element={<History />} />
        <Route path="/connect/youtube" element={<ConnectYouTube />} />
        <Route path="/connect/youtube" element={<ConnectYouTube />} />
        <Route path="/connect/facebook" element={<ConnectFacebook />} />
        <Route path="/connect/instagram" element={<ConnectInstagram />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
