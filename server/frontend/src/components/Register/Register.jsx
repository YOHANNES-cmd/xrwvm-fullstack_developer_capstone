import React, { useState } from "react";
import "./Register.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";

const Register = () => {
  // State variables for form inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");

  // Redirect to home
  const gohome = () => {
    window.location.href = window.location.origin;
  };

  // Handle form submission
  const register = async (e) => {
    e.preventDefault();
    let register_url = window.location.origin + "/djangoapp/register";

    // Send POST request to register endpoint
    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    });
    
    const json = await res.json();
    if (json.status) {
      // Save username in session and reload home
      sessionStorage.setItem("username", json.userName);
      window.location.href = window.location.origin;
    } else if (json.error === "Already Registered") {
      alert("The user with same username is already registered");
      window.location.href = window.location.origin;
    }
  };

  return (
    <div className="register_container" style={{ width: "50%", margin: "50px auto" }}>
      <div className="header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <span className="text" style={{ flexGrow: "1", fontSize: "2rem", fontWeight: "bold" }}>SignUp</span>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <a href="/" onClick={(e) => { e.preventDefault(); gohome(); }}>
            <img style={{ width: "24px", height: "24px" }} src={close_icon} alt="Close" />
          </a>
        </div>
      </div>
      <hr />
      
      <form onSubmit={register}>
        <div className="inputs" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div className="input" style={{ display: "flex", alignItems: "center" }}>
            <img src={user_icon} className="img_icon" alt="Username" style={{ paddingRight: "10px" }} />
            <input type="text" name="username" placeholder="Username" className="input_field" required onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="input" style={{ display: "flex", alignItems: "center" }}>
            <img src={user_icon} className="img_icon" alt="First Name" style={{ paddingRight: "10px" }} />
            <input type="text" name="first_name" placeholder="First Name" className="input_field" required onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="input" style={{ display: "flex", alignItems: "center" }}>
            <img src={user_icon} className="img_icon" alt="Last Name" style={{ paddingRight: "10px" }} />
            <input type="text" name="last_name" placeholder="Last Name" className="input_field" required onChange={(e) => setlastName(e.target.value)} />
          </div>
          <div className="input" style={{ display: "flex", alignItems: "center" }}>
            <img src={email_icon} className="img_icon" alt="Email" style={{ paddingRight: "10px" }} />
            <input type="email" name="email" placeholder="Email Address" className="input_field" required onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input" style={{ display: "flex", alignItems: "center" }}>
            <img src={password_icon} className="img_icon" alt="Password" style={{ paddingRight: "10px" }} />
            <input name="psw" type="password" placeholder="Password" className="input_field" required onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="submit_panel" style={{ marginTop: "20px", textAlign: "center" }}>
          <input className="submit btn text-white w-100 fw-bold py-2" type="submit" value="Register" style={{ backgroundColor: "darkturquoise" }} />
        </div>
      </form>
    </div>
  );
};

export default Register;
