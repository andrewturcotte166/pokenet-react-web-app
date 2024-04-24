import { useState, useEffect } from "react";
import * as client from "../Users/client";
import HomeView from "./HomeView";
import { TbPokeball } from "react-icons/tb";

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
            <h1 className="display-4">Welcome to Pokenet!</h1>
            <p className="lead">This is a social network for Pokemon fans where you can:</p>
            <ul>
                <li>Build your perfect team!</li>
                <li>Connect with Friends and Professors!</li>
                <li>Find more information about your favorite Pokemon!</li>
            </ul>
            {!profile && <HomeView/>}
            {profile && <h3>Welcome, {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()} {profile.firstName.charAt(0).toUpperCase() + profile.firstName.slice(1).toLowerCase()}</h3>}
        </div>
    );
}
export default Home;