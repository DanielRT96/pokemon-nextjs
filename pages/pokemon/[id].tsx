import { GetStaticPropsContext } from 'next';
import Link from 'next/link';
import React from 'react';
import { PokemonListResponse } from '..';
import Layout from '../../components/Layout';

type PokemonId = { id: string };

export async function getStaticPaths() {
  const response = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'
  );
  const { results }: PokemonListResponse = await response.json();

  const pokemonList = results.map((pokemon) => {
    const pokemonId = Number(pokemon.url.slice(0, -1).split('/').pop());
    return {
      name: pokemon.name,
      id: pokemonId,
      imgUrl: `https://rawgit.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
    };
  });

  return {
    paths: pokemonList.map((pokemon) => ({
      params: { id: pokemon.id.toString() },
    })),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<PokemonId>) {
  const id = params?.id;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();
  pokemon.image = `https://rawgit.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return {
    props: { pokemon },
    revalidate: 30,
  };
}

export default function PokemonDetails({ pokemon }: any) {
  return (
    <Layout title={pokemon.name}>
      <h1 className="text-4xl mb-2 text-center capitalize">{pokemon.name}</h1>
      <div className="flex flex-col items-center bg-purple-50 rounded-md p-8">
        <img className="mx-auto" src={pokemon.image} alt={pokemon.name} />
        <p>
          <span className="font-bold mr-2">Weight:</span> {pokemon.weight}
        </p>
        <p>
          <span className="font-bold mr-2">Height:</span>
          {pokemon.height}
        </p>
        <h2 className="text-2xl mt-6 mb-2">Types</h2>
        {pokemon.types.map((type: any, index: number) => (
          <p key={index}>{type.type.name}</p>
        ))}
      </div>
      <p className="mt-10 text-center">
        <Link legacyBehavior href="/">
          <a>
            <button className="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg">
              Home
            </button>
          </a>
        </Link>
      </p>
    </Layout>
  );
}
