import { useEffect, useState } from 'react';
import viteLogo from '/vite.svg';
import './css/App.css';
import Header from './components/header';
import Footer from './components/footer';
import EquipmentTable from '../src/firstPage/table';
import { CssBaseline, Container, Box } from '@mui/material';

function App() {
  const [backEndData, setBackEndData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/main_table");
        const data = await response.json();
        setBackEndData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!backEndData.length) {
    return <div>Loading...</div>;
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <CssBaseline />
      <Header />
      <Container component="main" sx={{ flex: 1 }}>
        {/* Main content goes here */}
                < EquipmentTable
                data = {backEndData} />

                
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
