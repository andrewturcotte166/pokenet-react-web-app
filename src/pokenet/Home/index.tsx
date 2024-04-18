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
            {profile && <h3>Welcome, {profile.role} {profile.firstName}</h3>}
        </div>
    );
}
export default Home;