import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://graphql-pokemon2.vercel.app/',
    cache: new InMemoryCache()
});

export const GetPokemonData = async (p) => {
    try {
        let first = (p*20);
        const data = await client.query({
            query: gql`
                query pokemons {
                pokemons(first: ${first}) {
                id
                number
                name
                types
                image
                  }
                }

            `
        });

        return data
    } catch (err) {
        console.log(err)
    }
}