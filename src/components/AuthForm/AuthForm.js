import React, { useState } from "react";
import "./AuthForm.css";

const AuthForm = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(false); // false = Register
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!password || (!isLogin && (!username || !email))) {
      alert("Please fill in all required fields.");
      return;
    }

    alert(`${isLogin ? "Login" : "Registration"} successful!`);
    console.log("Form Data:", formData);
    setFormData({ username: "", email: "", password: "" });
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isLogin ? "Login" : "Register"}</h2>

          {!isLogin && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </>
          )}

          {isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
