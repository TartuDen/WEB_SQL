import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';

export default function PlusButtons(props) {
    const { identifier, showField } = props;
  
    return (
      <Stack direction="row" spacing={1}>
        <IconButton onClick={() => showField(identifier)} aria-label="plus">
          <AddIcon />
        </IconButton>
      </Stack>
    );
  }