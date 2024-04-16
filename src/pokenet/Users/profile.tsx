import * as client from "./client";
import { useState, useEffect } from "react";
import { useNavigate, } from "react-router-dom";
import { BsTrash3Fill, } from "react-icons/bs";
// import { Pokemon } from "../Pokemon/client";
import * as pokeClient from "../Pokemon/client";
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();
function Profile() {
    const [profile, setProfile] = useState<any>();
    const [pokemonList, setPokemonList] = useState<any[]>([]);
    const [pokemon, setPokemon] = useState<any>({
        _id: "", userId: "", species: "", name: "", gender: "", level: 50, shiny: false,
    });
    const navigate = useNavigate();
    const fetchProfile = async () => {
        try {
            const account = await client.profile();
            setProfile(account);
        } catch (error) {
            navigate("/Pokenet/Account/Login");
        }
    };
    const fetchPokemon = async () => {
        if (profile && profile._id) {
            const pokemonList = await pokeClient.findPokemonByUser(profile);
            pokemonList.map(async (poke: any) => {
                const pokeData = await P.getPokemonByName(poke.species);
                poke.sprite = pokeData.sprites.front_default;
                poke.animatedSprite = pokeData.sprites.other.showdown.front_default;
            }
            );
            setPokemonList(pokemonList);
        }
    };
    // use this for updating profile attributes (not including team)
    const save = async () => {
        await client.updateUser(profile);
    };
    const signout = async () => {
        await client.signout();
        navigate("/Pokenet/Account/Login");
    };
    const deletePokemon = async (poke: any) => {
        try {
            await pokeClient.deletePokemon(poke);
            setPokemonList(pokemonList.filter((p) => p._id !== poke._id));
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    useEffect(() => {
        fetchPokemon();
    }, [profile]);
    return (
        <div>
            {profile && (
                <div>
                    <h1>Trainer Profile</h1>
                    <h3>Name: {profile.firstName}</h3>
                    <h3>Region: {profile.region}</h3>
                    <h3>Favorite Pokemon: {profile.favoritePokemon}</h3>
                    <h3>Favorite Type: {profile.favoriteType}</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <td>
                                    <h3>Team: </h3>
                                </td>
                                <td>
                                    <input value={pokemon.name} placeholder="pokemon name" onChange={(e) =>
                                        setPokemon({ ...pokemon, name: e.target.value })} />
                                </td>
                                <td>
                                    <input value={pokemon.level} placeholder="pokemon level" type="number" title="1 to 100" onChange={(e) =>
                                        setPokemon({ ...pokemon, level: parseInt(e.target.value) })} />
                                </td>
                                <td>
                                    <select value={pokemon.gender} onChange={(e) =>
                                        setPokemon({ ...pokemon, gender: e.target.value })}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Genderless">Genderless</option>
                                    </select>
                                </td>
                                <td>
                                    <label> Shiny?
                                        <input checked={pokemon.shiny} type="checkbox" onChange={(e) =>
                                            setPokemon({ ...pokemon, shiny: e.target.checked })} />
                                    </label>
                                </td>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokemonList.map((poke: any) => (
                                <tr key={poke._id} >
                                    <td><img src={poke.animatedSprite ? poke.animatedSprite : poke.sprite} alt="pokemon sprite"></img></td>
                                    <td>{poke.name}</td>
                                    <td>{poke.level}</td>
                                    <td>{poke.gender}</td>
                                    <td>{poke.shiny ? "Yes" : "No"}</td>
                                    <td>
                                <button onClick={() => deletePokemon(poke)}>
                                    <BsTrash3Fill />
                                </button>
                            </td>
                                </tr>))}
                        </tbody>
                    </table>
                    <h3>Friends:</h3>
                    <button className="btn btn-danger" onClick={signout}>
                        Signout
                    </button>
                </div>

            )}
        </div>
    );
}
export default Profile;