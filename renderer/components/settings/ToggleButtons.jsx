import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { namesAndColors } from "../../constants/colors";

export default function ToggleButtons({ handleAlignment, value }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      {namesAndColors.map((race) => (
        <ToggleButton value={race.index} aria-label="left aligned">
          {race.name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
