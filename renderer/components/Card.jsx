import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea } from "@mui/material";

export default function ActionAreaCard({ title, link, toDo }) {
  return (
    <Card
      onClick={toDo}
      sx={{
        width: 400,
        borderRadius: 2,
        color: "#e4e4e7",
        backgroundColor: "#18181b",
        padding: 1,
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={link}
          alt="green iguana"
          sx={{
            height: 150,
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#a1a1aa", textAlign: "justify" }}
          >
            Lizards are a widespread group of squamate reptiles, with over
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
