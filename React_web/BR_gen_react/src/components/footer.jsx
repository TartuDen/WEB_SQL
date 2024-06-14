import React from 'react';
import { AppBar, Toolbar, Typography, Container, Link, Box } from '@mui/material';

function Footer() {
    return (
        <AppBar position="sticky" color="primary" component="footer" sx={{ top: 'auto', bottom: 0 }}>
            <Container>
                <Box py={3} textAlign="center">
                    <Box component="nav" mb={3} display="flex" justifyContent="center" borderBottom={1} pb={2}>
                        <Link href="#" color="inherit" underline="none" mx={2}>Home</Link>
                        <Link href="#" color="inherit" underline="none" mx={2}>Features</Link>
                        <Link href="#" color="inherit" underline="none" mx={2}>Pricing</Link>
                        <Link href="#" color="inherit" underline="none" mx={2}>FAQs</Link>
                        <Link href="#" color="inherit" underline="none" mx={2}>About</Link>
                    </Box>
                    <Typography variant="body2" color="textSecondary">© 2023 Company, Inc</Typography>
                </Box>
            </Container>
        </AppBar>
    );
}

export default Footer;
