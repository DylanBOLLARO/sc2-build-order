import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function BasicTable({ data, local }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%" }} align="left">
              Line
            </TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell sx={{ width: "5%" }} align="center">
              Population
            </TableCell>
            <TableCell sx={{ width: "5%" }} align="center">
              Timer
            </TableCell>
            <TableCell sx={{ width: "15%" }} align="center">
              Option
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((line, index) => (
            <TableRow
              key={line.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{index + 1}</TableCell>
              <TableCell align="left">{line.content}</TableCell>
              <TableCell align="center">{line.population}</TableCell>
              <TableCell align="center">{line.timer}</TableCell>
              <TableCell align="center">OPTIONS</TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell align="left"></TableCell>
            <TableCell align="left">{local.description}</TableCell>
            <TableCell align="center">{local.population}</TableCell>
            <TableCell align="center">{local.timer}</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
