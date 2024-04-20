import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";
import { User } from "./client";
export default function Signup() {
    const [credentials, setCredentials] = useState<User>({
        _id: "", username: "", password: "", firstName: "", email: "", dob: "", lastName: "", role: "TRAINER",
    });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signup = async () => {
    try {
      await client.signup(credentials);
      navigate("/Pokenet/Account/Profile");
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  return (
    <div>
    <h1>Signup</h1>
    {error && <div>{error}</div>}
    <input value={credentials.username} placeholder="username" onChange={(e) => setCredentials({
        ...credentials, username: e.target.value
    })} /><br />
    <input value={credentials.password} placeholder="password" type="password" onChange={(e) => setCredentials({
        ...credentials, password: e.target.value
    })} /><br />
    <input value={credentials.firstName} placeholder="first name" onChange={(e) => setCredentials({
        ...credentials, firstName: e.target.value
    })} /><br />
    <input value={credentials.lastName} placeholder="last name" onChange={(e) => setCredentials({
        ...credentials, lastName: e.target.value
    })} /><br />
    <input value={credentials.dob} placeholder="date of birth" type="date" onChange={(e) => setCredentials({
        ...credentials, dob: e.target.value
    })} /><br />
    <input value={credentials.email} placeholder="email" onChange={(e) => setCredentials({
        ...credentials, email: e.target.value
    })} /><br />
    <select onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}> <br/>
            <option value="TRAINER">Trainer</option>
            <option value="PROFESSOR">Professor</option>
          </select><br />
    <button className="btn btn-success" onClick={signup}> Signup </button>
</div>
  );
}