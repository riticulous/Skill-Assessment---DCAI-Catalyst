import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import Home from './pages/Home';
import AppPage from './pages/AppPage';
import Assessment from './pages/Assessment';
import Report from './pages/Report';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/app"
            element={
              <AuthGuard>
                <AppPage />
              </AuthGuard>
            }
          />
          <Route
            path="/assessment/:sessionId"
            element={
              <AuthGuard>
                <Assessment />
              </AuthGuard>
            }
          />
          <Route
            path="/report/:sessionId"
            element={
              <AuthGuard>
                <Report />
              </AuthGuard>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
