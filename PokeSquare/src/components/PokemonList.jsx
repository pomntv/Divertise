import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReloadButton from './ReloadButton';
import './PokemonList.css';  

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);

  const fetchRandomPokemon = () => {
    // Generate an array of 9 unique random numbers between 1 and 898 (898 = all pokemon gen 1-8)
    const randomNumbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 898) + 1);

    // Fetch the Pokémon corresponding to the random numbers
    Promise.all(randomNumbers.map(number => {
      return axios.get(`https://pokeapi.co/api/v2/pokemon/${number}`);
    }))
    .then(pokemonDetails => {
      const pokemonWithImages = pokemonDetails.map(pokemon => ({
        name: pokemon.data.name,
        image: pokemon.data.sprites.front_default
      }));
      setPokemonData(pokemonWithImages);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };




  // random const of 6 picture
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  //fetch on click
  useEffect(() => { 
    fetchRandomPokemon();
  }, []);

  const redirectToPokedex = (pokemonName) => {
    // window.location.href = `https://www.serebii.net/pokedex-swsh/${pokemonName}/`;
    window.open(`https://www.serebii.net/pokedex-swsh/${pokemonName}/`, '_blank');
  };

  const fetchSingleRandomPokemon = async (index) => {
    const randomNumber = Math.floor(Math.random() * 898) + 1;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`);
    const newPokemon = {
      name: response.data.name,
      image: response.data.sprites.front_default,
    };
    const updatedPokemonData = [...pokemonData];
    updatedPokemonData[index] = newPokemon;
    setPokemonData(updatedPokemonData);
  };

  const handleDragEnd = (index) => {
    fetchSingleRandomPokemon(index);
  };

  return (
    <div>
      <h1>Random Pokémon List by <span style={{color: 'yellow'}}>Pom</span> <span style={{color: 'red'}}>Nantavit</span></h1>
      <ReloadButton onClick={fetchRandomPokemon} />
      <div className="pokemon-grid">
        {pokemonData.map((pokemon, index) => (
          <div 
            key={index} 
            className="pokemon-item" 
            style={{ border: `2px solid ${getRandomColor()}` }}
            onClick={() => redirectToPokedex(pokemon.name)}
            draggable
            onDragEnd={() => handleDragEnd(index)}
          >
            <img src={pokemon.image} alt={pokemon.name} />
            <p>{pokemon.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
