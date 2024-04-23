import { useState, useEffect } from "react";
import * as client from "../Users/client";

function Home() {
    const [profile, setProfile] = useState<any>();
    const fetchProfile = async () => {
        try {
            const account = await client.profile();
            setProfile(account);
        } catch (error) {
            console.log("Not logged in")
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []); 

    return(
        <div className="p-4">
            <h1>Welcome to Pokenet!</h1>
            {profile && <h3>Welcome, {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()} {profile.firstName.charAt(0).toUpperCase() + profile.firstName.slice(1).toLowerCase()}</h3>}
        </div>
    );
}
export default Home;