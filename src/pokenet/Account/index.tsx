import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Users/login";
import Profile from "../Users/profile";
import Trainer from "../Users/trainer";
import Signup from "../Users/signup";
import Trainers from "../Users/trainers";
export default function Account() {
    return (
        <div className="container-fluid p-4">
            <Routes>
                <Route path="/" element={<Navigate to="/Pokenet/Account/Profile" />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Profile/:username" element={<Trainer />} />
                <Route path="/Trainers" element={<Trainers />} />
                <Route path="/Signup" element={<Signup />} />
            </Routes>
        </div>
    );
}
