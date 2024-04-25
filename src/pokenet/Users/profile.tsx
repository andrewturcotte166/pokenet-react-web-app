import * as client from "./client";
import { useState, useEffect } from "react";
import { Link, useNavigate, } from "react-router-dom";
import { BsTrash3Fill, BsPencilFill } from "react-icons/bs";
import * as pokeClient from "../Pokemon/client";
import * as friendClient from "../Friends/client";
import Pokedex from 'pokedex-promise-v2';
import QuickProfile from "./quickProfile";
const P = new Pokedex();
function Profile() {
    const [profile, setProfile] = useState<any>();
    const [friends, setFriends] = useState<any>();
    const [friendsProfiles, setFriendsProfiles] = useState<any>();
    const [pokemonList, setPokemonList] = useState<any[]>([]);
    const [pokemon, setPokemon] = useState<any>({
        _id: "", userId: "", species: "", name: "", gender: "", level: 50, shiny: false,
    });
    const [professor, setProfessor] = useState<any>();
    const [trainers, setTrainers] = useState<any>();
    const fetchProfessor = async () => {
        try {
            const account = await client.findUserByUsername(profile.professorId);
            setProfessor(account);
        } catch (error) {
            console.log("Professor not found")
        }
    };
    const fetchTrainers = async () => {
        try {
            const trainers = await client.findUsersByProfessor(profile.username);
            setTrainers(trainers);
        } catch (error) {
            console.log("Professor not found")
        }
    };
    const navigate = useNavigate();
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

    useEffect(() => {
        const fetchFriends = async () => {
            if (profile) {
                try {
                    const friends = await friendClient.findFriendshipByUser(profile.username);
                    setFriends(friends);
                } catch (error) {
                    console.log(error);
                }
            }
        }

        fetchFriends();
    }, [profile]);

    useEffect(() => {
        const findProfile = async () => {
            if (friends && friends.length > 0) {
                try {
                    const userProfiles = await Promise.all(friends.map((friend: any) => client.findUserByUsername(friend.friendName)));
                    setFriendsProfiles(userProfiles);
                } catch (error) {
                    console.log("Profile not found");
                }
            }
        }

        findProfile();
    }, [friends]);

    const fetchPokemon = async () => {
        if (profile && profile._id) {
            const pokemonList = await pokeClient.findPokemonByUser(profile);
            pokemonList.map(async (poke: any) => {
                const pokeData = await P.getPokemonByName(poke.species);
                poke.sprite = pokeData.sprites.front_default;
                poke.animatedSprite = pokeData.sprites.other.showdown.front_default;
                poke.shinySprite = pokeData.sprites.front_shiny;
                poke.shinyAnimatedSprite = pokeData.sprites.other.showdown.front_shiny;
            }
            );
            setPokemonList(pokemonList);
        }
    };
    const save = async () => {
        await client.updateUser(profile);
    };
    const updatePokemon = async () => {
        await pokeClient.updatePokemon(pokemon);
        setPokemonList(pokemonList.map((p) => (p._id === pokemon._id ? pokemon : p)));
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
    const getSprite = (poke: any) => {
        if (poke.shiny) {
            return poke.shinyAnimatedSprite ? poke.shinyAnimatedSprite : poke.shinySprite;
        } else {
            return poke.animatedSprite ? poke.animatedSprite : poke.sprite;
        }
    }

    useEffect(() => {
        fetchPokemon();
        if (profile && profile.role === "TRAINER" && profile.professorId) {
            fetchProfessor();
        }
        if (profile && profile.role === "PROFESSOR") {
            fetchTrainers();
        }
    }, [profile, friends,]);
    return (
        <div>
            {profile && (
                <div>
                    <h1>My {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()} Profile
                        <button className="btn btn-primary ms-2" onClick={save}>
                            Save
                        </button>
                    </h1>
                    <label>
                        <h4>
                            Username: {profile.username}
                        </h4>
                    </label><br />
                    <label>
                        <h4>
                            Password:
                            <input value={profile.password} type="Password" className="ms-2" placeholder="Ketchum" onChange={(e) =>
                                setProfile({ ...profile, password: e.target.value })} />
                        </h4>
                    </label><br />
                    <label>
                        <h4>
                            First Name:
                            <input value={profile.firstName} className="ms-2" placeholder="Ash" onChange={(e) =>
                                setProfile({ ...profile, firstName: e.target.value })} />
                        </h4>
                    </label><br />
                    <label>
                        <h4>
                            Last Name:
                            <input value={profile.lastName} className="ms-2" placeholder="Ketchum" onChange={(e) =>
                                setProfile({ ...profile, lastName: e.target.value })} />
                        </h4>
                    </label><br />
                    <label>
                        <h4>
                            Email:
                            <input value={profile.email} className="ms-2" placeholder="user@email.com" onChange={(e) =>
                                setProfile({ ...profile, email: e.target.value })} />
                        </h4>
                    </label><br />
                    <label>
                        <h4>
                            Date of Birth:
                            <input value={profile.dob && profile.dob.split("T")[0]} type="Date" className="ms-2" onChange={(e) =>
                                setProfile({ ...profile, dob: e.target.value })} />
                        </h4>
                    </label><br />
                    <table className="table">
                        <thead>
                            <tr>
                                <td>
                                    <h3>Team: </h3>
                                </td>
                                <td>
                                    <label>
                                        Nickname:
                                        <input value={pokemon.name} className="ms-2" placeholder="pokemon name" onChange={(e) =>
                                            setPokemon({ ...pokemon, name: e.target.value })} />
                                    </label>
                                </td>
                                <td>
                                    <label>
                                        Level:
                                        <input value={pokemon.level} className="ms-2" placeholder="pokemon level" type="number" max="100" min="1" title="1 to 100" onChange={(e) =>
                                            setPokemon({ ...pokemon, level: parseInt(e.target.value) })} />
                                    </label>
                                </td>
                                <td>
                                    <label>
                                        Gender:
                                        <select value={pokemon.gender} className="ms-2" onChange={(e) =>
                                            setPokemon({ ...pokemon, gender: e.target.value })}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Genderless">Genderless</option>
                                        </select>
                                    </label>
                                </td>
                                <td>
                                    <label> Shiny?
                                        <input checked={pokemon.shiny} className="ms-2" type="checkbox" onChange={(e) =>
                                            setPokemon({ ...pokemon, shiny: e.target.checked })} />
                                    </label>
                                </td>
                                <td>
                                    <button className="btn btn-warning" onClick={() => updatePokemon()}>
                                        Update
                                    </button>
                                </td>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokemonList.map((poke: any) => (
                                <tr key={poke._id} >
                                    <td><img src={getSprite(poke)} alt="pokemon sprite"></img></td>
                                    <td><Link to={`/Pokenet/Details/${poke.species}`}> {poke.name}</Link></td>
                                    <td>{poke.level}</td>
                                    <td>{poke.gender}</td>
                                    <td>{poke.shiny ? "Yes" : "No"}</td>
                                    <td>
                                        <button onClick={() => setPokemon(poke)}>
                                            <BsPencilFill />
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => deletePokemon(poke)}>
                                            <BsTrash3Fill />
                                        </button>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                    {profile.role === "PROFESSOR" ?
                        (<>
                            <h3>Trainers:
                                <Link to="/Pokenet/Account/Trainers"
                                    className="btn btn-success ms-2">
                                    Edit Trainers
                                </Link>
                            </h3>
                            {trainers && trainers.map((trainer: any) => (
                                <div className="mb-2">
                                    <QuickProfile profile={trainer} /></div>))}
                        </>
                        ) :
                        (<>
                            <h3>Professor:</h3>
                            {professor ?
                                (<QuickProfile profile={professor} />) :
                                (<h4>No professor</h4>)}
                        </>
                        )}
                    <h3 className="mt-2">Friends:</h3>
                    {friendsProfiles && friendsProfiles.map((friendProfile: any) => (
                        <div className="mb-2">
                            <QuickProfile profile={friendProfile} />
                        </div>
                    ))}
                    <button className="btn btn-danger" onClick={signout}>
                        Signout
                    </button>
                </div>
            )}
        </div>
    );
}
export default Profile;