import axios from "axios";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.scss";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const handleStart = () => {
    setEmail(emailRef.current.value);
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    try {
      await axios.post("http://localhost:8800/api/auth/register", {
        email,
        username,
        password,
      });
      // بعد النجاح، اذهب للـ login
      navigate("/login");
    } catch (err) {
      console.log("Registration failed:", err);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="register">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
          <button className="loginButton" onClick={handleLoginClick}>
            Sign In
          </button>
        </div>
      </div>
      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        {!email ? (
          <div className="input">
            <input type="email" placeholder="email address" ref={emailRef} />
            <button className="registerButton" onClick={handleStart}>
              Get Started
            </button>
          </div>
        ) : (
          <form className="input-form">
            <input
              type="text"
              placeholder="Username"
              ref={usernameRef}
              className="form-input"
            />
            <input
              type="password"
              placeholder="Password"
              ref={passwordRef}
              className="form-input"
            />
            <button className="registerButton" onClick={handleFinish}>
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}