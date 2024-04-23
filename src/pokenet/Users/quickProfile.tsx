import * as client from "./client";
import { useState, useEffect } from "react";
import { Link, useNavigate, } from "react-router-dom";
import * as pokeClient from "../Pokemon/client";
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();
function QuickProfile({ profile }: any) {
    const [pokemonList, setPokemonList] = useState<any[]>([]);
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
    useEffect(() => {
        fetchPokemon();
    }, []);
    console.log(profile)
    return (
        <div className="row">
            <div className="row row-cols-6 card-group">
                <div className="card text-white bg-dark">
                    <img src="..." className="card-img-top card-header h-50" alt="trainer" />
                    <div className="card-body">
                        <h5 className="card-title"><Link to={`/Pokenet/Account/User/${profile.username}`}> {profile.firstName} {profile.lastName} </Link></h5>
                    </div>
                </div>
                {pokemonList.map((poke: any) => (
                    <div className="card border-dark">
                        <img src={poke.animatedSprite ? poke.animatedSprite : poke.sprite} className="card-img-top card-header h-50" alt="pokemon sprite" />
                        <div className="card-body">
                            <h5 className="card-title"><Link to={`/Pokenet/Search/${poke.species}`}> {poke.name}</Link></h5>
                        </div>
                    </div>))}
            </div>
        </div>
    );
}
export default QuickProfile;