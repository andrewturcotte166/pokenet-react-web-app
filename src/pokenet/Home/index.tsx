import { useState, useEffect } from "react";
import * as client from "../Users/client";
import * as friendClient from "../Friends/client";
import HomeView from "./HomeView";
import { TbPokeball } from "react-icons/tb";
import QuickProfile from "../Users/quickProfile";

function Home() {
    const [profile, setProfile] = useState<any>();
    const [friends, setFriends] = useState<any>();
    const [friendsProfiles, setFriendsProfiles] = useState<any>();
    const fetchProfile = async () => {
        try {
            const account = await client.profile();
            setProfile(account);
        } catch (error) {
            console.log("Not logged in")
        }
    };

    const fetchFriends = async () => {
        if (profile && profile._id) {
            try {
                console.log(profile.username)
                const friends = await friendClient.findFriendshipByUser(profile.username);
                setFriends(friends);
                console.log(friends);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const findProfile = async () => {
        try {
            const userProfiles = await Promise.all(friends.map((friend: any) => client.findUserByUsername(friend.friendName)));
            setFriendsProfiles(userProfiles);
        } catch (error) {
            console.log("profile not found");
        }
    }

    useEffect(() => {
        fetchProfile();
        fetchFriends();
        findProfile();
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
            <h3>Friends:</h3>
                    {friendsProfiles && friendsProfiles.map((friendProfile: any) => (
                        <QuickProfile profile={friendProfile} />
                    ))}
        </div>
    );
}
export default Home;