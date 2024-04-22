import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pokedex, { Pokemon } from 'pokedex-promise-v2';
import { User } from '../Users/client';
import * as pokeClient from "../Pokemon/client";
import * as userClient from "../Users/client";
import { BsPlusCircleFill } from 'react-icons/bs';
import { IoMdStar, IoMdStarOutline } from "react-icons/io";

const P = new Pokedex();

function PokemonDetails() {
    const { pokemonName } = useParams<{ pokemonName?: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isShiny, setIsShiny] = useState(false);
    const [profile, setProfile] = useState<User>({
        _id: "", username: "", password: "",
        firstName: "", lastName: "", dob: "", email: "", role: "USER"
    });
    

    const fetchPokemonDetails = async () => {
        if (pokemonName) {
            setIsLoading(true);
            try {
                const response = await P.getPokemonByName(pokemonName);
                setPokemon(response);
            } catch (error) {
                console.error("Failed to fetch Pokémon details:", error);
                setPokemon(null);
            } finally {
                setIsLoading(false);
            }
        } else {
            setPokemon(null);
            setIsLoading(false);
        }
    };
    const fetchProfile = async () => {
        try {
            const account = await userClient.profile();
            setProfile(account);
        } catch (error) {
            return
        }
    };

    useEffect(() => {
        fetchPokemonDetails();
        fetchProfile();
    }, [pokemonName]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!pokemon) {
        return <div>Pokémon not found</div>;
    }

    if (!pokemonName) {
        return <div>Loading...</div>;
    }

    const frontSprite = isShiny
        ? pokemon.sprites?.front_shiny
        : pokemon.sprites?.front_default;

    const animatedSprite = isShiny
        ? pokemon.sprites?.other?.showdown?.front_shiny
        : pokemon.sprites?.other?.showdown?.front_default;
    const types = pokemon.types.map((typeInfo) => typeInfo.type.name).join(', ');
    const height = pokemon.height / 10; // decimeters -> meters
    const weight = pokemon.weight / 10; // hectograms -> kilograms
    const pokedexNumber = pokemon.id;
    const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonName.toLowerCase()}.mp3`;
    const abilities = pokemon.abilities.map((ability) => ability.ability.name).join(', ');
    const baseExperience = pokemon.base_experience;
    const handleToggleShiny = () => {
        setIsShiny((prev) => !prev);
    };
    const createStatsTable = (stats: any[]) => {
        const total = stats.reduce((sum, stat) => sum + stat.base_stat, 0);
    
        return (
            <table className="table">
                <tbody>
                    <tr>
                        <td>HP</td><td>{stats.find(stat => stat.stat.name === 'hp')?.base_stat}</td>
                    </tr>
                    <tr>
                        <td>Attack</td><td>{stats.find(stat => stat.stat.name === 'attack')?.base_stat}</td>
                    </tr>
                    <tr>
                        <td>Defense</td><td>{stats.find(stat => stat.stat.name === 'defense')?.base_stat}</td>
                    </tr>
                    <tr>
                        <td>Sp. Atk</td><td>{stats.find(stat => stat.stat.name === 'special-attack')?.base_stat}</td>
                    </tr>
                    <tr>
                        <td>Sp. Def</td><td>{stats.find(stat => stat.stat.name === 'special-defense')?.base_stat}</td>
                    </tr>
                    <tr>
                        <td>Speed</td><td>{stats.find(stat => stat.stat.name === 'speed')?.base_stat}</td>
                    </tr>
                    <tr>
                        <td><strong>Total</strong></td><td><strong>{total}</strong></td>
                    </tr>
                </tbody>
            </table>
        );
    };

    const createMovesTable = (moves: any[]) => {
        const levelUpMoves = moves.filter(
            (move) =>
                move.version_group_details.some(
                    (details: { move_learn_method: { name: string; }; }) => details.move_learn_method.name === 'level-up'
                )
        );

        // sort level up moves ascending
        levelUpMoves.sort(
            (a, b) =>
                a.version_group_details.find(
                    (details: { move_learn_method: { name: string; }; }) => details.move_learn_method.name === 'level-up'
                ).level_learned_at -
                b.version_group_details.find(
                    (details: { move_learn_method: { name: string; }; }) => details.move_learn_method.name === 'level-up'
                ).level_learned_at
        );
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Lv.</th>
                        <th>Move</th>
                    </tr>
                </thead>
                <tbody>
                    {levelUpMoves.map((move, index) => {
                        const level = move.version_group_details.find(
                            (details: { move_learn_method: { name: string; }; }) => details.move_learn_method.name === 'level-up'
                        )?.level_learned_at ?? '--';
                        const moveName = move.move.name.replace(/-/g, ' ');

                        return (
                            <tr key={index}>
                                <td>{level}</td>
                                <td>{moveName}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };
    const createPokemon = async (poke: any) => {
        try {
            const newPokemon = await pokeClient.createPokemon({
                _id: "", userId: profile._id,
                species: poke.name, name: poke.name, gender: "Genderless", level: 50, shiny: isShiny, // might let you add a shiny pkmn straight from details
            });
            console.log(newPokemon)
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="display-3">{pokemon.name} (#{pokedexNumber}) 
            <button onClick={handleToggleShiny} style={{ backgroundColor: 'transparent', border: 'none' }}>
                {isShiny ? <IoMdStar size={80} color="gold" /> : <IoMdStarOutline size={80} color="black" />} 
            </button>
            <BsPlusCircleFill className="ms-2" onClick={() => createPokemon(pokemon.name)} />
            </h1>
            {frontSprite && (
                <img src={frontSprite} alt={`${pokemon.name} sprite`} />
            )}
            {animatedSprite && (
                <img src={animatedSprite} alt={`Animated ${pokemon.name} sprite`} />
            )}
            <p><strong>Types:</strong> {types}</p>
            <audio controls>
                <source src={cryUrl} type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>
            <p><strong>Height:</strong> {height} m</p>
            <p><strong>Weight:</strong> {weight} kg</p>
            <p><strong>Abilities:</strong> {abilities}</p>
            <p><strong>Base Experience:</strong> {baseExperience}</p>
            <p><strong>Base Stats:</strong> {createStatsTable(pokemon.stats)}</p>
            <p><strong>Level Up Moves:</strong> {createMovesTable(pokemon.moves)}</p>            
        </div>
    );
}

export default PokemonDetails;
