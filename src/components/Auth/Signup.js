import React, { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful! Please login now.");
      navigate("/login");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Inline style for gradient background
  const bgStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 52%, #5effdb 90%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  // Card styling
  const cardStyle = {
    width: 360,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
    color: "#fff",
    padding: "40px 30px 30px 30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backdropFilter: "blur(12px)",
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    marginBottom: 18,
    borderRadius: 6,
    border: "none",
    fontSize: 16,
    background: "rgba(255,255,255,0.22)",
    color: "#222",
  };

  const btnStyle = {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: 6,
    background: "linear-gradient(90deg,#fc6076 0%,#ff9a44 100%)",
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    boxShadow: "0 4px 20px rgba(252,96,118,0.15)",
    cursor: "pointer",
    marginTop: 10,
    marginBottom: 5,
    transition: "background 0.3s",
  };

  return (
    <div style={bgStyle}>
      <form style={cardStyle} onSubmit={handleSignup}>
        <div
          style={{
            marginBottom: 24,
            background: "rgba(255,255,255,0.21)",
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 32 }}>🙍‍♂️</span>
        </div>
        <h2 style={{ fontWeight: 700, marginBottom: 28, color: "#fff" }}>Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={inputStyle}
        />
        <button
          type="submit"
          style={btnStyle}
          onMouseEnter={(e) => (e.target.style.background = "linear-gradient(90deg,#ff7a81 0%,#ffa14e 100%)")}
          onMouseLeave={(e) => (e.target.style.background = "linear-gradient(90deg,#fc6076 0%,#ff9a44 100%)")}
        >
          Signup
        </button>
        {errorMsg && (
          <p
            style={{
              color: "#ffd6d6",
              background: "rgba(255,1,1,0.12)",
              padding: 8,
              marginTop: 10,
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
};

export default Signup;
