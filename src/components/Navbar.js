import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const Navbar = () => {
  const router = useRouter()
  return (
      <Box >
          <AppBar sx={{ p: '0px 60px', background: '#000' }} position="static">
              <Toolbar variant="dense">
                  <Typography onClick={() => router.push('/')} variant="h5" color="inherit" component="div">
                      Pokemon Gallery
                  </Typography>
              </Toolbar>
          </AppBar>
      </Box>
  )
}

export default Navbar