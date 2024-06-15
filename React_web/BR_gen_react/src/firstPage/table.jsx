import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CodeSelectorForMainTable from "./selectors_for_table";
import PlusButtons from "./addCodeButton";

export default function EquipmentTable(props) {
  // Logging props.data to ensure it has the expected structure
  console.log("props.data: ", props.data);

  const rows = props.data.map((elem) => {
    return {
      name: elem.name,
      fieldClicked: 0,
      code1: elem.equipmentInfo.map((item) => {
        return { code: item.code, description: item.description };
      }),
      code2: elem.equipmentInfo.map((item) => {
        return { code: item.code, description: item.description };
      }),
    };
  });


  const [rowsWithPlusClicked, setPlusClicked] = React.useState(rows);


  function showField(identifier) {

    setPlusClicked((prevState) => {
      const newState = prevState.map((item) => {
        if (item.name === identifier) {
          return { ...item, fieldClicked: item.fieldClicked + 1 };
        }
        return item;
      });

      // Logging newState to see the changes

      return newState;
    });
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {rowsWithPlusClicked.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
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
