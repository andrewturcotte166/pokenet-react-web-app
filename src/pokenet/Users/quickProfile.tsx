import { useState, useEffect } from "react";
import { Link, } from "react-router-dom";
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
        fetchPokemon();
    }, []);
    console.log(profile)
    return (
        <div className="row">
            <div className="row row-cols-6 card-group">
                <div className="card text-white text-center bg-dark" style={{maxWidth: 200}}>
                    <div className="card-body">
                        <h5 className="card-title"><Link to={`/Pokenet/Account/Profile/${profile.username}`}> {profile.firstName} {profile.lastName} </Link></h5>
                    </div>
                </div>
                {pokemonList.map((poke: any) => (
                    <div className="card border-dark" style={{maxWidth: 200}}>
                        <div className="text-center bg-light">
                            <img className="card-img-top mb-3 mt-3 w-auto" alt="" src={getSprite(poke)}/>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title text-center"><Link to={`/Pokenet/Details/${poke.species}`}> {poke.name}</Link></h5>
                        </div>
                    </div>))}
            </div>
        </div>
    );
}
export default QuickProfile;