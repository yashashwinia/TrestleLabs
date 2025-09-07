import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Navbar = () => {
  const navigate = useNavigate();
  const [btnHover, setBtnHover] = React.useState(false);

  const navStyle = {
    padding: "0 30px",
    height: 56,
    display: "flex",
    alignItems: "center",
    gap: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)",
    boxShadow: "0 4px 18px 0 rgba(42,80,182,0.07)",
    color: "#fff",
    zIndex: 2,
  };

  const linkBase = {
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1.1rem",
    padding: "7px 15px",
    borderRadius: 5,
    letterSpacing: 1,
    transition: "background 0.2s, color 0.2s",
    marginRight: "10px"
  };

  const activeLink = {
    background: "rgba(255,255,255,0.22)",
    color: "#fff",
  };

  const buttonStyle = {
    marginLeft: "auto",
    padding: "7px 18px",
    fontSize: "1rem",
    borderRadius: 5,
    border: "none",
    color: "#fff",
    background: btnHover
      ? "linear-gradient(90deg,#fc6076 0%,#ff9a44 100%)"
      : "rgba(255,255,255,0.18)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
    boxShadow: btnHover ? "0 0 8px #fc6076" : undefined,
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <NavLink
        to="/upload"
        style={({ isActive }) =>
          isActive ? { ...linkBase, ...activeLink } : linkBase
        }
      >
        Upload
      </NavLink>
      <NavLink
        to="/gallery"
        style={({ isActive }) =>
          isActive ? { ...linkBase, ...activeLink } : linkBase
        }
      >
        Gallery
      </NavLink>
      <button
        onClick={handleLogout}
        style={buttonStyle}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
