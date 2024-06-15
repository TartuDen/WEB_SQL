import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function CodeSelectorForMainTable(props) {
  let codeForSelect = props.dataForSelect.map((elem, idx) => {
    return elem.code;
  });
  let descForSelect = props.dataForSelect.map((elem, idx) => {
    return elem.description;
  });
  const [code, setCode] = React.useState("");

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">select Code</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={code}
          label="code"
          onChange={handleChange}
        >
            <MenuItem value="">none</MenuItem>
          {codeForSelect.map((code, idx) => {
            return (
              <MenuItem value={code} key={idx}>
                {code} {descForSelect[idx].length > 0 && `- ${descForSelect[idx]}`}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
