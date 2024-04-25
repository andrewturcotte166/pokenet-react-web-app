import { useState, useEffect } from "react";
import * as client from "./client";
import * as userClient from "../Users/client"
import { User } from "../Users/client";
import { BsPlusCircleFill } from "react-icons/bs";

function Friends() {
    const [profile, setProfile] = useState<any>();
    const [friends, setFriends] = useState<any>();
    const [trainers, setTrainers] = useState<User[]>([]);

    const fetchProfile = async () => {
        try {
            const account = await userClient.profile();
            setProfile(account);
        } catch (error) {
            console.log("Not logged in")
        }
    };

    const fetchFriends = async () => {
        try {
            //const friendships = await client.findFriendshipByUser(profile);
            const friendships = await client.findAllFriendships();
            setFriends(friendships);
        } catch (error) {
            console.log("Friendships not found")
        }
    }

    const fetchTrainers = async () => {
        const users = await userClient.findAllUsers();
        setTrainers(users);
    }

    const addFriend = async (trainer: User) => {
        try {
            await client.createFriend({userId: profile._id, friendId: trainer._id});
            fetchFriends();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTrainers();
        fetchProfile();
        fetchFriends();
    }, []); 
    console.log(friends);
    return (
        <div className="p-4">
            <h2>Friends</h2>
            <h2>Find Friends</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Level</th>
                    </tr>
                </thead>
                <tbody>
                    {trainers.map((trainer) => (
                        <tr key={trainer._id}>
                            <td>{trainer.firstName} {trainer.lastName}</td>
                            <td>{trainer.role}</td>
                            {profile._id && (
                                <BsPlusCircleFill className="ms-2" onClick={() => addFriend(trainer)} />
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Friends;