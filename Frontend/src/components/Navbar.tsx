import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { NavLink, useNavigate } from "react-router-dom";
import logoSrc from "../assets/img/Icon.png";
import avatarSrc from "../assets/img/ProfileIcon.png";
import "../styles/Navbar.scss";
import { useAuth } from "../context/AuthContext";
export type NavbarProps = {
  titleText?: string;
  onNavSelect?: (selectedKey: string | null) => void;
};

const Navbar = ({ titleText = "HexTech Hub", onNavSelect }: NavbarProps) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  return (
    <div className="navbar-container">
      {}
      <header className="navbar-header d-flex align-items-center justify-content-between p-3">
        {}
        <div className="d-flex align-items-center gap-2">
          <img
            src={logoSrc}
            alt="HexTech Hub Icon"
            className="img-fluid navbar-logo"
            width={100}
            height={100}
          />
          <h1 className="navbar-title m-0">{titleText}</h1>
        </div>

        {}
        <div className="navbar-account">
          {isAuthenticated ? (
            <Dropdown autoClose="outside">
              <Dropdown.Toggle
                id="navbar-account-toggle"
                className="navbar-account-btn"
                aria-label="Apri menu account"
                aria-haspopup="menu"
              >
                {imgError ? (
                  <i
                    className="bi bi-person-fill navbar-account-fallback"
                    aria-hidden="true"
                  ></i>
                ) : (
                  <img
                    src={avatarSrc}
                    alt="Immagine profilo utente"
                    onError={() => setImgError(true)}
                  />
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu
                align="end"
                className="navbar-account-dropdown"
                role="menu"
                aria-label="Menu account"
              >
                <Dropdown.Item href="#/profile">
                  <i className="bi bi-person me-2" aria-hidden="true"></i>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item href="#/settings">
                  <i className="bi bi-gear me-2" aria-hidden="true"></i>
                  Settings
                </Dropdown.Item>
                <Dropdown.Item href="#/administration">
                  <i className="bi bi-shield-lock me-2" aria-hidden="true"></i>
                  Administration
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as="button" onClick={() => { logout(); navigate("/", { replace: true }); }}>
                  <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <div
              className="navbar-auth-actions"
              aria-label="Authentication actions"
            >
              <button
                type="button"
                className="btn btn-primary navbar-auth-btn"
                onClick={() => navigate("/login")}
                aria-label="Go to login page"
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-warning text-dark navbar-auth-btn"
                onClick={() => navigate("/signup")}
                aria-label="Go to registration page"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {}
      <aside className="navbar-sidebar">
        <Nav className="flex-column" onSelect={onNavSelect}>
          <Nav.Link as={NavLink} to="/" end>
            <i className="bi bi-house me-2" aria-hidden="true"></i>
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/profile">
            <i className="bi bi-person me-2" aria-hidden="true"></i>
            Profile
          </Nav.Link>
          <Nav.Link eventKey="link-2">
            <i className="bi bi-trophy me-2" aria-hidden="true"></i>
            Tier List
          </Nav.Link>

          <Nav.Link as={NavLink} to="/Champions">
            <i className="bi bi-people me-2" aria-hidden="true"></i>
            Champions
          </Nav.Link>
          <Nav.Link as={NavLink} to="/Article">
            <i className="bi bi-journal-text me-2" aria-hidden="true"></i>
            Article
          </Nav.Link>
        </Nav>
      </aside>
    </div>
  );
};
export default Navbar;
