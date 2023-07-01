import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({
  raceBuildDisplayed,
  setRaceBuildDisplayed,
}) {
  const handleChange = (event) => {
    setRaceBuildDisplayed(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Race</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={raceBuildDisplayed}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={0}>Terran</MenuItem>
          <MenuItem value={1}>Zerg</MenuItem>
          <MenuItem value={2}>Protoss</MenuItem>
          <MenuItem value={3}>All</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
