import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-between">
            <a className="navbar-brand ms-4" href="#">Pokenet</a>
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link to={`/Pokenet/Account/Profile`} className="nav-link"> Profile </Link>
                </li>
                <li className="nav-item">
                    <Link to={`/Pokenet/Account/Login`} className="nav-link"> Login </Link>
                </li>
            </ul>
            <form className="form-inline my-2 my-lg-0" onSubmit={() => navigate(`/Pokenet/Search/${keyword}`)}>
                <input className="form-control mr-sm-2" type="search" placeholder="Search" title="try: electric / pikachu / 25" aria-label="Search"
                    onChange={(e) => setKeyword(e.target.value)} value={keyword}  />
                <Link to={`/Pokenet/Search/${keyword}`} className="btn btn-outline-success my-2 my-sm-0"> Search </Link>
            </form>
        </nav>
    );
}
export default NavBar;