import type { GetStaticPropsResult } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';

export type PokemonListResponse = {
  count: number;
  next: string;
  previous: string | null;
  results: { name: string; url: string }[];
};

type HomeProps = {
  pokemonList: { name: string; id: number; imgUrl: string }[];
};

export default function Home({ pokemonList }: HomeProps) {
  return (
    <Layout title="Explore Pokemons!">
      <h1 className="text-4x1 mb-8 text-center">Explore Pokemons!</h1>
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.id}>
            <Link legacyBehavior href={`/pokemon/${pokemon.id}`}>
              <a className="border p-4 border-grey my-2 hover:shadow-md capitalize flex items-center text-lg bg-gray-200 rounded-md">
                <img
                  src={pokemon.imgUrl}
                  alt={pokemon.name}
                  className="w-20 h-20 mr-3"
                ></img>
                <span className="mr-2 font-bod">{pokemon.id}.</span>
                {pokemon.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<HomeProps>
> {
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
    props: {
      pokemonList,
    },
  };
}
