import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="home-header">
      <div className="home-logo" onClick={() => navigate("/home")}>
        <img src="/logo.png" alt="Athlyx Logo" />
        <span className="brand-name">Athlyx</span>
      </div>

      <nav className="home-nav">
        <button
          className={isActive("/home") ? "active" : ""}
          onClick={() => navigate("/home")}
        >
          Home
        </button>

        <button
          className={isActive("/discover") ? "active" : ""}
          onClick={() => navigate("/discover")}
        >
          Discover
        </button>

        <button
          className={isActive("/about") ? "active" : ""}
          onClick={() => navigate("/about")}
        >
          About
        </button>

        <button
          className={isActive("/contact") ? "active" : ""}
          onClick={() => navigate("/contact")}
        >
          Contact
        </button>

        <button
          className={isActive("/help") ? "active" : ""}
          onClick={() => navigate("/help")}
        >
          Help
        </button>
      </nav>
    </header>
  );
};

export default Navbar;