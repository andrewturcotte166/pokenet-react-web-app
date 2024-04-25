import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as client from "../Users/client"; // Import your authentication client
import "./navBarCSS.css";

function NavBar() {
    const [keyword, setKeyword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                await client.profile();
                setAuthenticated(true);
            } catch (error) {
                setAuthenticated(false);
            }
        };
        checkAuthStatus();
    }, [location.pathname]); 

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-between">
            <Link to={`/Pokenet/Home`} className="navbar-brand ms-4 centered-link"> Pokenet </Link>
           <div className="center-container">
           <ul className="navbar-nav mr-auto">
                {authenticated ? (
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to={`/Pokenet/Account/Profile`} className="nav-link centered-link"> Profile </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`/Pokenet/Users/Search`} className="nav-link centered-link"> Find Friends </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={`/Pokenet/`} onClick={() => client.signout()} className="nav-link centered-link"> Signout </Link>
                    </li>
                </ul>
                ) : (
                    <li className="nav-item">
                        <Link to={`/Pokenet/Account/Login`} className="nav-link centered-link"> Login </Link>
                    </li>
                )}
            </ul>
           </div>
            <form className="form-inline my-2 my-lg-0" onSubmit={() => navigate(`/Pokenet/Search/${keyword}`)}>
                <input className="form-control mr-sm-2" type="search" placeholder="Search" title="try: electric / pikachu / 25" aria-label="Search"
                    onChange={(e) => setKeyword(e.target.value.toLowerCase())} value={keyword}  />
                <Link to={`/Pokenet/Search/${keyword}`} className="btn btn-outline-success my-2 my-sm-0"> Search </Link>
            </form>
        </nav>
    );
}
export default NavBar;