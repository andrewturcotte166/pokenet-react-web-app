import React, { useEffect, useState } from "react";
import axios from "axios";
function PokemonView() {
    const [pokemonChoice, setPokemonChoice] = useState("pikachu");
    const [pokemon, setPokemon] = useState<any>();
    const fetchPokemon = async (pokemon: String) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            setPokemon(response.data);
        }
        catch {
            console.log("Pokemon does not exist")
        }
    };
    return (
        <div>
            <h1>{pokemon ? pokemon.name.toUpperCase() : "Select a Pokemon"}</h1>
            <h2>
                <img src={pokemon ? pokemon.sprites.front_default : "#"} alt="pokemon sprite"></img>
                <img src={pokemon ? pokemon.sprites.other.showdown.front_default : "#"} alt="animated pokemon sprite"></img>
            </h2>
            <input type="text"
                onChange={(e) => setPokemonChoice(e.target.value)} value={pokemonChoice} />
            <button className="btn btn-primary" onClick={() => fetchPokemon(pokemonChoice)} >
                Get Pokemon
            </button>
        </div>
    );
}

export default PokemonView;