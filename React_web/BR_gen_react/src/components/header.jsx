import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    BR Generator
                </Typography>
                <Button color="inherit">
                    LOG IN with Google
                </Button>
                <Button color="inherit">
                    LOG IN with Facebook
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
