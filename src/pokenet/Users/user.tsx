import { useState, useEffect } from "react";
import { useParams, } from "react-router-dom";
import * as client from "./client";
import Trainer from "./trainer";
export default function UserAccount() {
    const { username } = useParams();
    const [account, setAccount] = useState();
    const [role, setRole] = useState("");
    const fetchProfile = async () => {
        try {
            const account = await client.findUserByUsername(username);
            setAccount(account);
            setRole(account.role);
        } catch (error) {
            console.log("User not found")
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    return (
        <div>
            {role && (<Trainer trainer={account}/>)}
        </div>
    );
}
