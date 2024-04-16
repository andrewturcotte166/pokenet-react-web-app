import axios from "axios";
export const BASE_API = process.env.REACT_APP_API_BASE;
export const POKEMON_API = `${BASE_API}/api/pokemon`;
export interface Pokemon {
    _id: string; userId: string, species: string; name: string; gender: string; level: number;
    shiny: boolean
};
export const updatePokemon = async (pokemon: any) => {
    const response = await axios.put(`${POKEMON_API}/${pokemon._id}`, pokemon);
    return response.data;
};
export const findAllPokemon = async () => {
    const response = await axios.get(`${POKEMON_API}`);
    return response.data;
};
export const findPokemonByUser = async (user: any) => {
    const response = await axios.get(`${POKEMON_API}/user/${user._id}`);
    return response.data;
};
export const createPokemon = async (pokemon: any) => {
    const response = await axios.post(`${POKEMON_API}`, pokemon);
    return response.data;
};
export const deletePokemon = async (pokemon: any) => {
    const response = await axios.delete(
        `${POKEMON_API}/${pokemon._id}`);
    return response.data;
};