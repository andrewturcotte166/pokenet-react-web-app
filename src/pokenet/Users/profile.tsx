import * as client from "./client";
import { useState, useEffect } from "react";
import { Link, useNavigate, } from "react-router-dom";
function Profile() {
    const [profile, setProfile] = useState<any>();
    const navigate = useNavigate();
    const fetchProfile = async () => {
        try {
            const account = await client.profile();
            setProfile(account);
        } catch (error) {
            // navigate("/Pokenet/Account/Login");
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    return (

        <div>
            {profile && (
                <div>
                    <h1>Trainer Profile</h1>
                    <h3>Name: {profile.firstName}</h3>
                    <h3>Region: {profile.region}</h3>
                    <h3>Favorite Pokemon: {profile.favoritePokemon}</h3>
                    <h3>Favorite Type: {profile.favoriteType}</h3>
                    <h3>Team: </h3>
                    <h3>Friends:</h3>
                </div>
            )}
        </div>
    );
}
export default Profile;