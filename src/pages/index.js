import Navbar from '@/components/Navbar';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Box, Pagination, Stack, styled, Paper, Typography, List, ListItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetPokemonData } from '@/components/GetPokemonData';

let initialData = 60

const client = new ApolloClient({
  uri: 'https://graphql-pokemon2.vercel.app/',
  cache: new InMemoryCache()
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const firstIndex = 0;

export default function Home({ data }) {
  let router = useRouter()
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [pokemons, setPokemons] = useState(data.data.pokemons.slice(firstIndex, pageSize));

  useEffect(() => {
    setPokemons(() => data.data.pokemons.slice(0, pageSize));
  }, [pageSize]);

  const handleChange = async (event, value) => {
    if(value > 3) {
      const res = await GetPokemonData(value);
      data = res;
    }
    setPage(value);
    setPokemons(() => data.data.pokemons.slice(firstIndex + pageSize * (value - 1), pageSize * value));
  };

  return (
    <Stack spacing={2}>
      <Item elevation={0} sx={{ p: 0 }} ><Navbar /></Item>
      <Item>
        <Stack p="5" spacing={2}>
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Pagination
              count={8}
              page={page}
              onChange={handleChange}
              size="large"
              variant="outlined"
              shape="rounded"
            />
          </Box>
          <List sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
            textDecoration: 'none',
            padding: '0px 100px',
            margin: '0',
          }}>
            {pokemons.map(pokemon => {
              return (
                <ListItem key={pokemon.id} sx={{
                  border: '1px solid #eaeaea',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }} >
                  <Stack sx={{ textDecoration: 'none', width: '100%' }} onClick={() => router.push(`/${pokemon.name}_${pokemon.id}`)}>
                    <Stack style={{ display: 'block' }}>
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                      />
                      <div
                        style={{
                          padding: '10px',
                          backgroundColor: '#f8f8f8',
                          borderTop: '1px solid #eaeaea',
                          width: '100%'
                        }}
                      >
                        <Typography
                          style={{
                            color: '#000',
                            margin: '0',
                            fontWeight: 'bold',
                            textTransform: 'none',
                          }}
                        >
                          {pokemon.name} | {pokemon.number}
                        </Typography>
                        <Typography style={{ color: '#000', margin: '0', width: '100%', fontSize: '14px' }}>
                          Types: {pokemon.types.join(', ')}
                        </Typography>
                      </div>
                    </Stack>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Pagination
              count={8}
              page={page}
              onChange={handleChange}
              size="large"
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </Stack>
      </Item>
    </Stack>
  );
}

export async function getServerSideProps() {
  let first = initialData;
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

  return {
    props: {
      data: data
    }
  }
}
