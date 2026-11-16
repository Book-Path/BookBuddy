import React from "react";
import './LoginPage.css';

const LoginPage = (props) => {
  const AUTH_URL = `${props.api_url}/auth/github`;
  return (
    <div className="login-page">
      <h1>BookBuddy</h1>
      <center>
        <a href={AUTH_URL}>
          <button className="login-btn">Login via Github</button>
        </a>
      </center>
    </div>
  );
};

export default LoginPage;