import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="home-header">
      <div className="home-logo" onClick={() => navigate("/home")}>
        <img src="/logo.png" alt="Athlyx Logo" />
        <span className="brand-name">Athlyx</span>
      </div>

      <nav className="home-nav">
        <button onClick={() => navigate("/home")}>
          Home
        </button>

        <button onClick={() => navigate("/discover")}>
          Discover
        </button>

        <button onClick={() => navigate("/about")}>
          About
        </button>

        <button onClick={() => navigate("/contact")}>
          Contact
        </button>
        <button onClick={() => navigate("/help")}>
          Help
        </button>
      </nav>
    </header>
  );
};

export default Navbar;