import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Users/login";
import Profile from "../Users/profile";
import Trainer from "../Users/trainer";
export default function Account() {
    return (
        <div className="container-fluid p-4">
            <Routes>
                <Route path="/" element={<Navigate to="/Pokenet/Account/Profile" />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/User/:username" element={<Trainer />} />
            </Routes>
        </div>
    );
}
