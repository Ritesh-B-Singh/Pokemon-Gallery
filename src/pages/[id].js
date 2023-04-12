import React, { useState } from 'react'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Box, Modal, Stack, styled, Paper, Typography, Card, CardActionArea, CardMedia, CardContent, Button, ImageListItem, ImageList, ListSubheader, ImageListItemBar } from '@mui/material';
import Navbar from '@/components/Navbar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const client = new ApolloClient({
  uri: 'https://graphql-pokemon2.vercel.app/',
  cache: new InMemoryCache()
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'row',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: 8,
  p: 4,
};


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const GetPokemonDetails = ({ data, evolutions }) => {
  const [isLoading, setIsLoading] = useState(false)
  const pokemon = data.pokemon
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [pokemonEvolutions, setPokemonEvolutions] = useState(evolutions.data.pokemon.evolutions ? [{
    id: pokemon.id,
    image: pokemon.image,
    name: pokemon.name,
    number: pokemon.number,
    types: pokemon.types
  }, ...evolutions.data.pokemon.evolutions] : [{
    id: pokemon.id,
    image: pokemon.image,
    name: pokemon.name,
    number: pokemon.number,
    types: pokemon.types
  }])

  return (
    <Stack spacing={2}>
      <Item elevation={0} sx={{ p: 0 }} ><Navbar /></Item>
      <Item>
        <Stack display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={1}>
          <Typography variant='h2' sx={{ color: '#272727' }} >{pokemon.name} #{pokemon.number}</Typography>
          <img style={{
            width: '30%',
            height: '250px'
          }} src={pokemon.image} alt={pokemon.name} />
          <Typography>Name: {pokemon.name}</Typography>
          <Typography>Number: {pokemon.number}</Typography>
          <Typography>Height: {pokemon.height.minimum} - {pokemon.height.maximum}</Typography>
          <Typography>Weight: {pokemon.weight.minimum} - {pokemon.weight.maximum}</Typography>
          <Typography>Classification: {pokemon.classification}</Typography>
          <Typography>Types: {pokemon.types.join(', ')}</Typography>
          <Typography>Resistant: {pokemon.resistant.join(', ')}</Typography>
          <Typography>Weaknesses: {pokemon.weaknesses.join(', ')}</Typography>
          <Button onClick={handleOpen} variant='contained' size='small' >View Evolutions</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {pokemonEvolutions.map((evolution, index) => (
                <ImageList key={index} sx={{ width: '300px', height: '200px' }}>
                  <ImageListItem>
                    <img
                      src={evolution.image}
                      srcSet={evolution.image}
                      alt={evolution.name}
                      style={{ objectFit: 'fill' }}
                    />
                    <ImageListItemBar
                      title={evolution.name}
                      subtitle={<Typography style={{ margin: '0', width: '100%', fontSize: '14px' }}>
                        Types: {evolution.types.join(', ')}
                      </Typography>}
                    />
                  </ImageListItem>
                  {(pokemonEvolutions.length - 1) !== index && <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <ArrowForwardIosIcon fontSize='large' />
                  </Box>}
                </ImageList>
              ))}
            </Box>
          </Modal>
        </Stack>
      </Item>
    </Stack>
  )
}

export default GetPokemonDetails

export async function getServerSideProps({ query }) {
  const name = query.id.split('_')[0];
  const id = query.id.split('_')[1];

  const { data } = await client.query({
    query: gql`
      query GetPokemon($id: String!, $name: String!) {
        pokemon(id: $id, name: $name) {
          id
          number
          name
          weight {
            minimum
            maximum
          }
          height {
            minimum
            maximum
          }
          types
          classification
          resistant
          weaknesses
          image
        }
      }
    `,
    variables: { id, name },
  });

  const evolutions = await client.query({
    query: gql`
      query pokemon($id: String, $name: String){
        pokemon(id: $id, name: $name){
          id
          name
          evolutions{
            id
            number
            name
            types
            image
          }
        }
      }
    `,
    variables: { id, name },
  });

  return {
    props: {
      data: data,
      evolutions: evolutions
    },
  };
}