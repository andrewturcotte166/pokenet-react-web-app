import { useState, useEffect } from "react";
import { Link, } from "react-router-dom";
import "./quickProfile.css";
import * as pokeClient from "../Pokemon/client";
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();
function QuickProfile({ profile }: any) {
    const [pokemonList, setPokemonList] = useState<any[]>([]);
    const fetchPokemon = async () => {
        if (profile && profile._id) {
            const pokemonList = await pokeClient.findPokemonByUser(profile);
            const updatedPokemonList = await Promise.all(pokemonList.map(async (poke: any) => {
                const pokeData = await P.getPokemonByName(poke.species);
                return {
                    ...poke,
                    sprite: pokeData.sprites.front_default,
                    animatedSprite: pokeData.sprites.other.showdown.front_default,
                    shinySprite: pokeData.sprites.front_shiny,
                    shinyAnimatedSprite: pokeData.sprites.other.showdown.front_shiny,
                };
            }));
            setPokemonList(updatedPokemonList);
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
    }, [profile]); // Rerun fetchPokemon when `profile` changes
    
    return (
        <div className="profile-container">
            <div className="profile-info">
                <div className="card text-white text-center bg-dark">
                    <div className="card-body">
                        <h5 className="card-title">
                            <Link to={`/Pokenet/Account/Profile/${profile.username}`}>
                                {profile.firstName} {profile.lastName}
                            </Link>
                        </h5>
                    </div>
                </div>
            </div>
            <div className="pokemon-card-container">
                <div className="scrollable-container">
                    {pokemonList.map((poke: any) => (
                        <div className="card pokemon-card" key={poke._id}>
                            <div className="text-center bg-light">
                                <img className="card-img-top mb-3 mt-3 w-auto" alt={poke.species} src={getSprite(poke)} />
                            </div>
                            <div className="card-body">
                                <h5 className="card-title text-center"><Link to={`/Pokenet/Details/${poke.species}`}>{poke.name}</Link></h5>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default QuickProfile;