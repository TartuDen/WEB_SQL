import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Container } from '@mui/material';

function InputProjTpVers(props) {
    const suggestion = props.savedChoise.map((elem,idx)=>{
        if(elem.project){
            return {label: elem.project}
        }else if(elem.tp){
            return {label: elem.tp}
        }
        return {lable: ["aaa","bbb"]}
        
    })
  return (
    <Container>
        <Autocomplete
          options={suggestion}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Project" variant="outlined" />}
          style={{ width: 300 }}
          onChange={(event,value)=>{
            props.checkChoice(value.label)
          }}
        />
    </Container>
  );
}

export default InputProjTpVers;
