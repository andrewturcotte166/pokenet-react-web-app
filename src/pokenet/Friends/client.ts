import axios from "axios";
export const BASE_API = process.env.REACT_APP_API_BASE;
export const FRIENDS_API = `${BASE_API}/api/friends`;
export interface Friendship {
    _id: string; userId: string, friendId: string
};
export const createFriend = async (friendship: any) => {
    const response = await axios.post(`${FRIENDS_API}`, {
        userId: friendship.userId, friendId: friendship.friendId
    });
    return response.data;
}
export const findAllFriendships = async () => {
    const response = await axios.get(`${FRIENDS_API}`);
    return response.data;
}
export const findFriendshipById = async (friendId: any) => {
    const response = await axios.get(`${FRIENDS_API}/${friendId}`);
    return response.data;
}
export const findFriendshipByUser = async (userId: any) => {
    const response = await axios.get(`${FRIENDS_API}/user/${userId}`);
    return response.data;
}
export const updateFriendship = async (friendId: any, friend: any) => {
    const response = await axios.put(`${FRIENDS_API}/${friendId}`, friend);
    return response.data;
}
export const deleteFriendship = async (friendId: any) => {
    const response = await axios.delete(
        `${FRIENDS_API}/${friendId}`);
    return response.data;
}