import React, { useState } from "react";
import { myaxios } from "../../services/http";
import "./style.css";

const url = "/api/login/";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const reset = () => {
    setUsername("");
    setPassword("");
  };

  const onSubmit = (e) => {
    myaxios
      .post(url, { username, password })
      .then((res) => {
        console.log(res);
        const { access, refresh } = res.data;
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        reset();
        window.location.reload();
      })
      .catch((err) => {
        alert(JSON.stringify(err.response.data));
        console.log(err.response.data);
      });
    e.preventDefault();
  };

  return (
    <div className="card">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            placeholder="Password"
          />
        </div>
        <button type="submit" className="btn btn-default">
          Submit
        </button>
      </form>
    </div>
  );
}
