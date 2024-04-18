import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import * as client from "../Users/client";

function Home() {
    const [profile, setProfile] = useState<any>();
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const account = await client.profile();
                setAuthenticated(true);
                setProfile(account);
            } catch (error) {
                setAuthenticated(false);
            }
        };
        checkAuthStatus();
    }, [location.pathname]); 
    
    return(
        <div className="p-4">
            <h1>Welcome to Pokenet!</h1>
            {authenticated && <h3>Welcome, {profile.role} {profile.firstName}</h3>}
        </div>
    );
}
export default Home;