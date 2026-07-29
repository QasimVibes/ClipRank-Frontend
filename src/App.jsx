import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Submit from './pages/Submit';
import Processing from './pages/Processing';
import Gallery from './pages/Gallery';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"                  element={<Submit />} />
          <Route path="/processing/:jobId" element={<Processing />} />
          <Route path="/gallery/:jobId"    element={<Gallery />} />
          <Route path="/history"           element={<History />} />
          <Route path="*"                  element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
