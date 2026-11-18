import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");

  const isActive = (path) => location.pathname === path;

  return (
    <header className="home-header">
      <div className="home-logo" onClick={() => navigate("/home")}>
        <img src="/logo.png" alt="Athlyx Logo" />
        <span className="brand-name">Athlyx</span>
      </div>

      <div className="home-nav-actions">
        <nav className="home-nav">
          <button
            className={isActive("/home") ? "active" : ""}
            onClick={() => navigate("/home")}
          >
            {t("nav.home")}
          </button>

          <button
            className={isActive("/discover") ? "active" : ""}
            onClick={() => navigate("/discover")}
          >
            {t("nav.discover")}
          </button>

          <button
            className={isActive("/about") ? "active" : ""}
            onClick={() => navigate("/about")}
          >
            {t("nav.about")}
          </button>

          <button
            className={isActive("/contact") ? "active" : ""}
            onClick={() => navigate("/contact")}
          >
            {t("nav.contact")}
          </button>

          <button
            className={isActive("/help") ? "active" : ""}
            onClick={() => navigate("/help")}
          >
            {t("nav.help")}
          </button>
        </nav>

        <LanguageSwitcher inline />
      </div>
    </header>
  );
};

export default Navbar;