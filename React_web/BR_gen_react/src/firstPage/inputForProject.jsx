import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Container } from '@mui/material';

function InputProjTpVers(props) {
    const suggestions2 = props.savedProjects.map((elem,idx)=>{
        console.log("............elem.project.......\n",elem.project);
        return {label: elem.project.length>0 && elem.project}
    })
  return (
    <Container>
        <Autocomplete
          options={suggestions2}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Project" variant="outlined" />}
          style={{ width: 300 }}
        />
    </Container>
  );
}

export default InputProjTpVers;
