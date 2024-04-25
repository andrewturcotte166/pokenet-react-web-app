import axios from "axios";
export const BASE_API = process.env.REACT_APP_API_BASE;
export const FRIENDS_API = `${BASE_API}/api/friends`;
export interface Friendship {
    _id: string; userName: string, friendName: string
};
export const createFriend = async (friendship: any) => {
    const response = await axios.post(`${FRIENDS_API}`, {
        userName: friendship.userName, friendName: friendship.friendName
    });
    return response.data;
}
export const findAllFriendships = async () => {
    const response = await axios.get(`${FRIENDS_API}`);
    return response.data;
}
export const findFriendshipById = async (friendName: any) => {
    const response = await axios.get(`${FRIENDS_API}/${friendName}`);
    return response.data;
}
export const findFriendshipByUser = async (userName: String) => {
    const response = await axios.get(`${FRIENDS_API}/user/${userName}`);
    return response.data;
}
export const updateFriendship = async (friendName: any, friend: any) => {
    const response = await axios.put(`${FRIENDS_API}/${friendName}`, friend);
    return response.data;
}
export const deleteFriendship = async (friendName: any) => {
    const response = await axios.delete(
        `${FRIENDS_API}/${friendName}`);
    return response.data;
}