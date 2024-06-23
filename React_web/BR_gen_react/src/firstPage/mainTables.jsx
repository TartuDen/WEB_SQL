import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CodeSelectorForMainTable from "./selectors_for_table";
import {PlusButtons, PlusMaterialButton} from "./addCodeButton";

import TableHead from '@mui/material/TableHead';

import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Material } from "../../../BR_gen_express/public/opClassesMOCK";

function EquipmentTable(props) {
  const rows = props.data.map((elem) => ({
    name: elem.equipment,
    fieldClicked: 0,
    code1: elem.equipmentInfo.map((item) => ({
      code: item.code,
      description: item.description,
    })),
    code2: elem.equipmentInfo.map((item) => ({
      code: item.code,
      description: item.description,
    })),
  }));

  const [rowsWithPlusClicked, setPlusClicked] = React.useState(rows);

  function showField(identifier) {
    setPlusClicked((prevState) => {
      const newState = prevState.map((item) => {
        if (item.name === identifier) {
          return { ...item, fieldClicked: item.fieldClicked + 1 };
        }
        return item;
      });
      return newState;
    });
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableBody>
          {rowsWithPlusClicked.map((row) => (
            <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.name}
                <PlusButtons showField={showField} identifier={row.name} />
              </TableCell>

              {row.fieldClicked >= 1 && (
                <TableCell align="right">
                  <CodeSelectorForMainTable dataForSelect={row.code1} />
                </TableCell>
              )}

              {row.fieldClicked >= 2 && (
                <TableCell align="right">
                  <CodeSelectorForMainTable dataForSelect={row.code2} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}





const materialTypes = ["Starting Material", "Reagent", "Solvent", "Process Aid"];

function MatTable(props) {
  const [rows, setRows] = React.useState([
    new Material()
  ]);

  function handleInputChange(event, index, field) {
    const newRows = [...rows];
    newRows[index][field] = event.target.value;
    setRows(newRows);
  }

  function addRow(){
    setRows(prevRows=>[...prevRows, new Material()])
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 900 }} aria-label="simple table">
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                <TextField
                  value={row.name}
                  onChange={(event) => handleInputChange(event, index, "name")}
                  label="Reagent Name"
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  value={row.mass}
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={(event) => handleInputChange(event, index, "mass")}
                  label="Mass"
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  value={row.wh_code}
                  onChange={(event) => handleInputChange(event, index, "wh_code")}
                  label="WH Code"
                />
              </TableCell>
              <TableCell align="right">
                <Select
                  value={row.type}
                  onChange={(event) => handleInputChange(event, index, "type")}
                  label="Type"
                >
                  {materialTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          ))}
          
        </TableBody>
        <PlusMaterialButton addRow={addRow} />
      </Table>
    </TableContainer>
  );
}

export { EquipmentTable, MatTable };
