import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Container } from "@mui/material";

function InputProj(props) {
  const suggestion = props.select.map((elem) => {
    return { label: elem.project };
  });

  return (
    <Container>
      <Autocomplete
        disablePortal
        id="project"
        options={suggestion}
        renderInput={(params) => <TextField {...params} label="Projects" />}
        style={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        onChange={(event, value) => {
          props.funcCheckChoiceProj(value ? value.label : null);
        }}
      />
    </Container>
  );
}

function InputTp(props) {
  const suggestion = props.select.map((elem) => {
    return { label: elem.tp };
  });

  return (
    <Container>
      <Autocomplete
        disablePortal
        id="tp"
        options={suggestion}
        renderInput={(params) => <TextField {...params} label="TPs" />}
        style={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        onChange={(event, value) => {
          props.funcCheckChoiceTp(value ? value.label : null);
        }}
      />
    </Container>
  );
}

function InputVersion(props) {
  const suggestion = props.select.map((elem) => {
    return { label: elem.version };
  });

  return (
    <Container>
      <Autocomplete
        disablePortal
        id="version"
        options={suggestion}
        renderInput={(params) => <TextField {...params} label="Versions" />}
        style={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        onChange={(event, value) => {
          props.funcCheckChoiceVersion(value ? value.label : null);
        }}
      />
    </Container>
  );
}

export { InputProj, InputTp, InputVersion };
