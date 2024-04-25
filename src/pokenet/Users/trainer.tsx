import * as client from "./client";
import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import * as pokeClient from "../Pokemon/client";
import Pokedex from 'pokedex-promise-v2';
import QuickProfile from "./quickProfile";
const P = new Pokedex();
function Trainer() {
    const location = useLocation();
    const { username } = useParams();
    const [account, setAccount] = useState<any>();
    const fetchProfile = async () => {
        try {
            const account = await client.findUserByUsername(username);
            setAccount(account);
        } catch (error) {
            console.log("User not found")
        }
    };
    const [pokemonList, setPokemonList] = useState<any[]>([]);
    const [professor, setProfessor] = useState<any>();
    const [trainers, setTrainers] = useState<any>();
    const fetchProfessor = async () => {
        try {
            const professor = await client.findUserByUsername(account.professorId);
            setProfessor(professor);
        } catch (error) {
            console.log("Professor not found")
        }
    };
    const fetchTrainers = async () => {
        try {
            const trainers = await client.findUsersByProfessor(account.username);
            setTrainers(trainers);
        } catch (error) {
            console.log("Professor not found")
        }
    };
    const fetchPokemon = async () => {
        if (account && account._id) {
            const pokemonList = await pokeClient.findPokemonByUser(account);
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
    const getSprite = (poke: any) => {
        if (poke.shiny) {
            return poke.shinyAnimatedSprite ? poke.shinyAnimatedSprite : poke.shinySprite;
        } else {
            return poke.animatedSprite ? poke.animatedSprite : poke.sprite;
        }
    }
    useEffect(() => {
        fetchProfile();
    }, []);
    useEffect(() => {
        if (account && account._id) {
            fetchPokemon();
            if (account.role === "TRAINER" && account.professorId) {
                fetchProfessor();
            }
            if (account.role === "PROFESSOR") {
                fetchTrainers();
            }
        }
    }, [location.pathname, account,]);
    return (
        <div>
            {account && (
                <div>
                    <h1>{account.username.charAt(0).toUpperCase() + account.username.slice(1).toLowerCase()}'s Profile</h1>
                    <h3>Name: {account.firstName} {account.lastName}</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <td>
                                    <h3>Team: </h3>
                                </td>
                                <td>
                                    Nickname
                                </td>
                                <td>
                                    Level
                                </td>
                                <td>
                                    Gender
                                </td>
                                <td>
                                    Shiny?
                                </td>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokemonList.map((poke: any) => (
                                <tr key={poke._id} >
                                    <td><img src={getSprite(poke)} alt="pokemon sprite"></img></td>
                                    <td>{poke.name}</td>
                                    <td>{poke.level}</td>
                                    <td>{poke.gender}</td>
                                    <td>{poke.shiny ? "Yes" : "No"}</td>
                                </tr>))}
                        </tbody>
                    </table>
                    {account.role === "PROFESSOR" ?
                        (<>
                            <h3>Trainers:</h3>
                            {trainers && trainers.map((trainer: any) => (<QuickProfile profile={trainer} />))}
                        </>
                        ) :
                        (<>
                            <h3>Professor:</h3>
                            {professor ?
                                (<QuickProfile profile={professor} />) :
                                (<h4>No professor</h4>)}
                        </>
                        )}
                    {/* TODO: if logged in, show friends, if not, don't */}
                    <h3>Friends:</h3>
                </div>

            )
            }
        </div >
    );
}
export default Trainer;