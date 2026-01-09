// src/components/Layout.jsx
import { useNavigate, Link } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");          // go to Home landing page
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo">SmartFeedback</div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          {/* user links */}
          <Link to="/user">Dashboard</Link>
      

          <button className="nav-logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="app-main">{children}</main>

      {/* footer... */}
    </div>
  );
}

export default Layout;
