import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import './css/App.css'
import Header from './components/header'
import Footer from './components/footer'

import { CssBaseline, Container, Box, Typography } from '@mui/material';

function App() {
  const [backendData, setBackEndData]=useState({msg: ''});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api");
        const data = await response.json();
        setBackEndData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <CssBaseline />
            <Header />
            <Container component="main" sx={{ flex: 1 }}>
                {/* Main content goes here */}
                {backendData.msg}
                
            </Container>
            <Footer />
        </Box>
    );
}

export default App
