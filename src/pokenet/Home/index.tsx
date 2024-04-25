import { useState, useEffect } from "react";
import * as client from "../Users/client";
import HomeView from "./HomeView";
import { Link, } from "react-router-dom";
import Pokedex from 'pokedex-promise-v2';

function Home() {
    const [profile, setProfile] = useState<any>();
    const [spotlightPokemon, setSpotlightPokemon] = useState<any>([]);
    const P = new Pokedex();
    const fetchRandomPokemon = async () => {
        const randomIndex = Math.floor(Math.random() * 905) + 1;
        try {
            const randomPokemon = await P.getPokemonByName(randomIndex);
            setSpotlightPokemon({
                name: randomPokemon.name,
                pokedexNumber: randomPokemon.id,
                sprite: randomPokemon.sprites.front_default,
                animatedSprite: randomPokemon.sprites.other.showdown.front_default,
            });
        } catch (error) {
            console.error("Failed to fetch random Pokémon:", error);
            setSpotlightPokemon(null);
        }
    };
    const fetchProfile = async () => {
        try {
            const account = await client.profile();
            setProfile(account);
        } catch (error) {
            console.log("Not logged in")
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchRandomPokemon();
    }, []);

    return (
        <div className="p-4">
            <div className="row row-cols-2">
                <div>
                    <h1 className="display-4">Welcome to Pokenet!</h1>
                    <p className="lead">This is a social network for Pokemon fans where you can:</p>
                    <ul>
                        <li>Build your perfect team!</li>
                        <li>Connect with Friends and Professors!</li>
                        <li>Find more information about your favorite Pokemon!</li>
                    </ul>
                </div>

                <div className="mt-2">
                    <h2>Pokemon Spotlight</h2>
                    {spotlightPokemon && (
                        <div className="mt-2">
                            <h1 className="display-5">
                                <Link to={`/Pokenet/Details/${spotlightPokemon.name}`} style={{ textDecoration: "none", color: "black" }}>
                                    <p style={{ fontSize: 'calc(1.3rem + .6vw)' }}>{spotlightPokemon.name} #{spotlightPokemon.pokedexNumber}</p>
                                    <img src={spotlightPokemon.sprite} alt={spotlightPokemon.name} />
                                    <img src={spotlightPokemon.animatedSprite} alt={`Animated ${spotlightPokemon.name} sprite`} />
                                </Link>
                            </h1>
                        </div>
                    )}
                </div>
            </div>
            {!profile && <HomeView />}
            {profile && <h3>Welcome, {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()} {profile.firstName.charAt(0).toUpperCase() + profile.firstName.slice(1).toLowerCase()}</h3>}
        </div>
    );
}
export default Home;