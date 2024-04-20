import * as client from "./client";
import { useState, useEffect } from "react";
import { Link, useLocation, } from "react-router-dom";
import * as pokeClient from "../Pokemon/client";
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();
function Trainer({ trainer }: any) {
    const location = useLocation();
    const [pokemonList, setPokemonList] = useState<any[]>([]);
    const [professor, setProfessor] = useState<any>();
    const [trainers, setTrainers] = useState<any>();
    const fetchProfessor = async () => {
        try {
            const account = await client.findUserByUsername(trainer.professorId);
            setProfessor(account);
        } catch (error) {
            console.log("Professor not found")
        }
    };
    const fetchTrainers = async () => {
        try {
            const trainers = await client.findUsersByProfessor(trainer.username);
            setTrainers(trainers);
        } catch (error) {
            console.log("Professor not found")
        }
    };
    const fetchPokemon = async () => {
        if (trainer && trainer._id) {
            const pokemonList = await pokeClient.findPokemonByUser(trainer);
            pokemonList.map(async (poke: any) => {
                const pokeData = await P.getPokemonByName(poke.species);
                poke.sprite = pokeData.sprites.front_default;
                poke.animatedSprite = pokeData.sprites.other.showdown.front_default;
            }
            );
            setPokemonList(pokemonList);
        }
    };
    useEffect(() => {
        console.log(location)
        fetchPokemon();
        if (trainer.role === "TRAINER" && trainer.professorId) {
            fetchProfessor();
        }
        if (trainer.role === "PROFESSOR") {
            fetchTrainers();
        }
    }, [location.pathname]);
    return (
        <div>
            {trainer && (
                <div>
                    {trainer.role === "PROFESSOR" ? (
                        <h1>Professor Profile</h1>) :
                        <h1>Trainer Profile</h1>}
                    <h3>Name: {trainer.firstName}</h3>
                    <h3>Region: {trainer.region}</h3>
                    <h3>Favorite Pokemon: {trainer.favoritePokemon}</h3>
                    <h3>Favorite Type: {trainer.favoriteType}</h3>
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
                                    <td><img src={poke.animatedSprite ? poke.animatedSprite : poke.sprite} alt="pokemon sprite"></img></td>
                                    <td>{poke.name}</td>
                                    <td>{poke.level}</td>
                                    <td>{poke.gender}</td>
                                    <td>{poke.shiny ? "Yes" : "No"}</td>
                                </tr>))}
                        </tbody>
                    </table>
                    {/* TODO: refactor to use a shared component that displays friend/professor/trainer information */}
                    {trainer.role === "PROFESSOR" ?
                        (<>
                            <h3>Trainers:</h3>
                            {trainers && trainers.map((trainer: any) => (
                                <h4>Name: <Link to={`/Pokenet/Account/User/${trainer.username}`}> {trainer.firstName} {trainer.lastName} </Link></h4>))}
                        </>
                        ) :
                        (<>
                            <h3>Professor:</h3>
                            {professor ?
                                (<>
                                    <h4>Name: <Link to={`/Pokenet/Account/User/${professor.username}`}> {professor.firstName} {professor.lastName} </Link></h4>
                                </>) :
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