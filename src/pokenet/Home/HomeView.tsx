import React, { useEffect, useState } from "react";
import * as client from "../Users/client";
import * as pokeClient from "../Pokemon/client";
import { User } from "../Users/client";
import { Link } from "react-router-dom";
import Pokedex from 'pokedex-promise-v2';
import QuickProfile from "../Users/quickProfile";

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
                <div className="mt-2">
                    <QuickProfile profile={trainer} />
                </div>
            ))}
            <h2>Pokemon Spotlight</h2>
        </div>
    );
}

export default TrainerView;