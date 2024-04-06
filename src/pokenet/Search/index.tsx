import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();
const API_BASE = process.env.REACT_APP_API_BASE;
function Search() {
    const { keyword } = useParams();
    const [results, setResults] = useState<any>([]);

    const findResults = async () => {
        const types = (await P.getTypesList()).results;
        const typeList = types.map((t: any) => t.name);
        if (keyword) {
            // if user searchs for a type (i.e. water, fire, etc.)
            if (typeList.includes(keyword)) {
                const response = await P.getResource(`/api/v2/type/${keyword}`);
                const shortenedResults = response.pokemon.slice(0, 5); // could introduce pagination here
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
    }, [])
    return (
        <div className="p-4">
            <h1>{`Search results for "${keyword}":`}</h1>
            {results[0] ? (
                results.map((result: any) =>
                    <h3>
                        {result.name ? result.name : result.pokemon.name}
                        {result.sprites && (
                            <>
                                <img src={result.sprites.front_default} alt="pokemon sprite"></img>
                                <img src={result.sprites.other.showdown.front_default} alt="animated pokemon sprite"></img>
                            </>
                        )}
                    </h3>)
            ) : <h3>No results</h3>}
        </div>
    );
}

export default Search;