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

const GetPokemonDetails = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false)
  const pokemon = data.pokemon
  let f = 0
  const [evolutions, setEvolutions] = useState([{
    id: pokemon.id,
    image: pokemon.image,
    name: pokemon.name,
    number: pokemon.number,
    types: pokemon.types
  }])
  const [open, setOpen] = React.useState(false);
  const handleOpen = async () => {
    if (f == 0){
    try {
      const res = await client.query({
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
        variables: { id: pokemon.id, name: pokemon.name },
      });
      setEvolutions(oldArray => [...oldArray, ...res.data.pokemon.evolutions])
    } catch (err) {
      console.log(err)
    }
    f = 1;
  }
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  return (
    <Stack spacing={2}>
      <Item elevation={0} sx={{ p: 0 }} >
        <Navbar />
      </Item>
      <Item>
        <Stack display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={2}>
          <Typography variant='h2' sx={{ color: '#272727' }} >{pokemon.name} #{pokemon.number}</Typography>
          <img style={{
            width: '30%',
            height: '250px',
            borderRadius: '10px'
          }} src={pokemon.image} alt={pokemon.name} />
          <Typography variant='body1'><strong>Name:</strong> {pokemon.name}</Typography>
          <Typography variant='body1'><strong>Number:</strong> {pokemon.number}</Typography>
          <Typography variant='body1'><strong>Height:</strong> {pokemon.height.minimum} - {pokemon.height.maximum}</Typography>
          <Typography variant='body1'><strong>Weight:</strong> {pokemon.weight.minimum} - {pokemon.weight.maximum}</Typography>
          <Typography variant='body1'><strong>Classification:</strong> {pokemon.classification}</Typography>
          <Typography variant='body1'><strong>Types:</strong> {pokemon.types.join(', ')}</Typography>
          <Typography variant='body1'><strong>Resistant:</strong> {pokemon.resistant.join(', ')}</Typography>
          <Typography variant='body1'><strong>Weaknesses:</strong> {pokemon.weaknesses.join(', ')}</Typography>
          <Button onClick={handleOpen} variant='contained' size='small' sx={{ marginTop: '16px' }}>View Evolutions</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {evolutions.map((evolution, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <ImageList sx={{ width: '100%', height: 'auto' }}>
                    <ImageListItem>
                      <img
                        src={evolution.image}
                        srcSet={evolution.image}
                        alt={evolution.name}
                        style={{ objectFit: 'fill', borderRadius: '10px', height: '200px', width: '200px' }}
                      />
                      <ImageListItemBar
                        title={evolution.name}
                        subtitle={<Typography style={{ margin: '0', width: '100%', fontSize: '14px' }}>
                          <strong>Types:</strong> {evolution.types.join(', ')}
                        </Typography>}
                      />
                    </ImageListItem>
                  </ImageList>
                  <Box sx={{ pl: 2, pr: 2 }}>
                    {(evolutions.length - 1) !== index && (
                      <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <ArrowForwardIosIcon fontSize="large" />
                      </Box>
                    )}
                  </Box>
                </Box>
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


  return {
    props: {
      data: data
    },
  };
}