import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {
  matchUpTerran,
  matchUpProtoss,
  matchUpZerg,
} from "../constants/matchup";

export default function AlertDialog({ title, selectionOne }) {
  const [open, setOpen] = useState(false);
  const [selectionTwo, setSelectionTwo] = useState([]);

  const [selectionOneState, setSelectionOneState] = useState(
    selectionOne.length - 1
  );
  const [selectionTwoState, setSelectionTwoState] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, setState) => {
    setState(event.target.value);
  };

  useEffect(() => {
    switch (selectionOneState) {
      case 0:
        setSelectionTwo(matchUpTerran);
        console.log(selectionTwoState);
        break;

      case 1:
        setSelectionTwo(matchUpZerg);
        console.log(selectionTwoState);
        break;

      case 2:
        setSelectionTwo(matchUpProtoss);
        console.log(selectionTwoState);

        break;

      default:
        break;
    }
  }, [selectionOneState]);

  return (
    <div>
      <Button size="large" onClick={handleClickOpen}>
        {title}
      </Button>
      <Dialog
        open={open}
        disableEscapeKeyDown
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Which build order do you want to see ?"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <FormControl variant="outlined" margin="dense">
              <InputLabel id="demo-simple-select-label">Race</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectionOneState}
                label="selectionOneState"
                onChange={(e) => {
                  handleChange(e, setSelectionOneState);
                }}
                sx={{ minWidth: 100 }}
              >
                {selectionOne.map((selection, index) => (
                  <MenuItem value={index}>{selection}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" margin="dense">
              <InputLabel id="demo-simple-select-label">Match-up</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectionTwoState}
                label="selectionTwoState"
                onChange={(e) => {
                  // handleChange(e, setSelectionTwoState);
                  console.log(selectionTwoState);
                }}
                sx={{ minWidth: 100 }}
              >
                {selectionTwo.map((selection, index) => (
                  <MenuItem value={index}>{selection}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
