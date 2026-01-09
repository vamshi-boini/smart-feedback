import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages: no header/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />

        {/* Pages with header/footer */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        {/* User dashboard (protected) */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route
            path="/user"
            element={
              <Layout>
                <UserDashboard />
              </Layout>
            }
          />
        </Route>

        {/* Admin dashboard (protected) */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route
            path="/admin"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
