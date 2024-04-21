import { useEffect, useState, } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "./client";
import * as client from "./client";
export default function Login() {
    const [credentials, setCredentials] = useState<User>({
        _id: "", username: "", password: "", firstName: "", email: "", dob: "", lastName: "", role: "USER",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const login = async () => {
        try {
            await client.signin(credentials);
            navigate("/Pokenet/Account/Profile");
        }
        catch (err: any) {
            if (err.response) {
                setError(err.response.data.message);
            }
        }
    };

    const fetchProfile = async () => {
        try {
            await client.profile();
            navigate("/Pokenet/Account/Profile");
        } catch (error) {
  
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div>
            <h1>Login</h1>
            {error && <div>{error}</div>}
            <input value={credentials.username} placeholder="username" onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })} /><br />
            <input value={credentials.password} placeholder="password" type="password" onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })} /><br />
            <button className="btn btn-primary mt-2" onClick={login}> Login </button>
            <Link to="/Pokenet/Account/Signup"
                className="btn btn-success ms-2 mt-2">
                Signup
            </Link>
        </div>
    );
}
