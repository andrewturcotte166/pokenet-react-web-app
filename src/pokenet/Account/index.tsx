import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Users/login";
import Profile from "../Users/profile";
import Signup from "../Users/signup";
export default function Account() {
    return (
        <div className="container-fluid p-4">
            <Routes>
                <Route path="/" element={<Navigate to="/Pokenet/Account/Profile" />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Signup" element={<Signup />} />
                {/* <Route path="/Admin/Users" element={<UserTable />} /> */}
            </Routes>
        </div>
    );
}
