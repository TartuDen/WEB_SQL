import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CodeSelectorForMainTable from './selectors_for_table';

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

export default function EquipmentTable(props) {
    const rows = props.data.map((elem, idx)=>{
        return ({
            name: elem.name,
            code1: elem.equipmentInfo.map((item,idx)=>{
                return {code: item.code, description: item.description}
            }),
            code2: elem.equipmentInfo.map((item,idx)=>{
                return {code: item.code, description: item.description}
            })
        })
    })

    
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right"> <CodeSelectorForMainTable
              dataForSelect = {row.code1} /> </TableCell>
              
              <TableCell align="right"> <CodeSelectorForMainTable
              dataForSelect = {row.code2} /> </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
