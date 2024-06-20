import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Container } from "@mui/material";

function InputProjTpVers(props) {
  const suggestion = props.savedChoise.map((elem) => {
    return { label: elem.project };
  });
  console.log(".........suggestion.......\n", suggestion);

  return (
    <Container>
      <Autocomplete
        disablePortal
        id="project"
        options={suggestion}
        renderInput={(params) => <TextField {...params} label="projects" />}
        style={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        onChange={(event, value) => {
          props.funcCheckChoice(value ? value.label : null);
        }}
      />
    </Container>
  );
}

export default InputProjTpVers;
