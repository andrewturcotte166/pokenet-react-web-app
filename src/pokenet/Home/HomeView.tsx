import React, { useEffect, useState } from "react";
import * as client from "../Users/client";
import * as pokeClient from "../Pokemon/client";
import { User } from "../Users/client";
import { Link } from "react-router-dom";
import Pokedex from 'pokedex-promise-v2';

function TrainerView() {
    const [trainers, setTrainers] = useState<User[]>([]);
    const [spotlightPokemon, setSpotlightPokemon] = useState<any>([]);
    const [trainersPokemon, setTrainersPokemon] = useState<{ [key: string]: any[] }>({});
    const P = new Pokedex();
    const fetchPokemon = async (trainer: User) => {
        const pokemonList = await pokeClient.findPokemonByUser(trainer);
        const detailedPokemonList = await Promise.all(pokemonList.map(async (poke: any) => {
            const pokeData = await P.getPokemonByName(poke.species);
            return {
                ...poke,
                sprite: pokeData.sprites.front_default,
                animatedSprite: pokeData.sprites.other.showdown.front_default
            };
        }));

        setTrainersPokemon(prev => ({
            ...prev,
            [trainer._id]: detailedPokemonList
        }));
    };

    const fetchTrainers = async () => {
        const users = await client.findAllUsers();
        setTrainers(users);
        users.forEach((user: User) => fetchPokemon(user));
    };
    
    useEffect(() => { 
        fetchTrainers();
    }, []);   
    
    return (
        <div>
            <h2>Registered Trainers</h2>
            {trainers.slice(0, 3).map((trainer) => (
            <div className="row">
                <div className="row row-cols-6 card-group">
                    <div className="card text-white bg-dark">
                        <img src="..." className="card-img-top card-header h-50" alt="trainer" />
                        <div className="card-body">
                            <h5 className="card-title"> {trainer.firstName} {trainer.lastName} </h5>
                        </div>
                    </div>
                    {trainersPokemon[trainer._id]?.slice(0,3).map((poke: any) => (
                            <div className="card border-dark" key={poke.id}>
                                <img src={poke.animatedSprite || poke.sprite} className="card-img-top card-header h-50" alt={poke.name} style={{ width: '100%', height: '100%' }} />
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Link to={`/Pokenet/Details/${poke.species}`}>{poke.name}</Link>
                                    </h5>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            ))}
            <h2>Pokemon Spotlight</h2>
        </div>
    );
}

export default TrainerView;