import { Link, useParams, } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { Pokemon } from "../Pokemon/client";
import { User } from "../Users/client";
import * as pokeClient from "../Pokemon/client";
import * as userClient from "../Users/client";
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();
function Search() {
    const { keyword } = useParams();
    const [profile, setProfile] = useState<User>({
        _id: "", username: "", password: "",
        firstName: "", lastName: "", dob: "", email: "", role: "USER"
    });
    const [results, setResults] = useState<any>([]);
    const [pokemon, setPokemon] = useState<Pokemon>({
        _id: "", userId: "", species: "", name: "", gender: "Genderless", level: 50, shiny: false,
    });
    const fetchProfile = async () => {
        try {
            const account = await userClient.profile();
            setProfile(account);
        } catch (error) {
            return
        }
    };
    const findResults = async () => {
        const types = (await P.getTypesList()).results;
        const typeList = types.map((t: any) => t.name);
        if (keyword) {
            // if user searchs for a type (i.e. water, fire, etc.)
            if (typeList.includes(keyword)) {
                const response = await P.getResource(`/api/v2/type/${keyword}`);
                const shortenedResults = response.pokemon.slice(0, 50); // could introduce pagination here
                const urls = shortenedResults.map((item: any) => item.pokemon.url);
                const fullResponse = await P.getResource(urls);
                setResults(fullResponse);
            } else { // defaults to searching for pokemon of that name
                try {
                    // might also use getPokemonSpeciesByName to get different forms (i.e. wishiwashi-school, unown)
                    const response = await P.getPokemonByName(keyword);
                    console.log(response);
                    setResults([response]);
                } catch (e) {
                    setResults([]);
                    console.log(e);
                }
            }
        }
    };
    useEffect(() => {
        findResults();
        fetchProfile();
    }, [keyword])
    const createPokemon = async (poke: any) => {
        try {
            const newPokemon = await pokeClient.createPokemon({
                _id: "", userId: profile._id,
                species: poke.name, name: poke.name, gender: "Genderless", level: 50, shiny: false,
            });
            console.log(newPokemon)
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="p-4">
            <h1>{`Search results for "${keyword}":`}</h1>
            <div className="results-container" style={{ overflowY: "scroll", maxHeight: "580px" }}>
                <div className="results-list">
                    {results[0] ? (
                        results.map((result: any, key=result.name) => (
                            <div className="result-item">
                                <h3>
                                    <Link to={`/Pokenet/Details/${result.name}`}>
                                    {result.name ? result.name : result.pokemon.name}
                                    {result.sprites && (
                                        <>
                                            <img src={result.sprites.front_default} alt="pokemon sprite"></img>
                                            <img src={result.sprites.other.showdown.front_default} alt="animated pokemon sprite"></img>
                                            {profile._id && (
                                                <BsPlusCircleFill className="ms-2" onClick={() => createPokemon(result)} />
                                            )}
                                        </>
                                    )}
                                    </Link>
                                </h3>
                            </div>
                        ))
                    ) : (
                        <h3>No results</h3>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Search;