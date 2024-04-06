import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import store from "./store";
import { Provider } from "react-redux";
import Search from "./Search";
import Home from "./Home";
import NavBar from "./Home/NavBar";
import Account from "./Account";
const API_BASE = process.env.REACT_APP_API_BASE;
function Pokenet() {
    const [trainers, setTrainers] = useState<any[]>([]);;
    const [trainer, setTrainer] = useState();
    const TRAINERS_API = `${API_BASE}/api/trainers`;
    const findAllTrainers = async () => {
        const response = await axios.get(TRAINERS_API);
        setTrainers(response.data);
    };

    return (
        <Provider store={store}>
            <NavBar />
            <Routes>
                <Route path="/" element={<Navigate to="Home" />} />
                <Route path="Home" element={<Home />} />
                <Route path="/Account/*" element={<Account />} />
                <Route path="Search/:keyword/*" element={<Search />} />
            </Routes>
        </Provider>
    );
}
export default Pokenet;