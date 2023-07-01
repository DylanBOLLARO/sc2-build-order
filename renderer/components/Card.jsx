import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea } from "@mui/material";

export default function ActionAreaCard({ title, link, toDo, message }) {
  return (
    <Card
      onClick={toDo}
      sx={{
        width: 400,
        borderRadius: 2,
        padding: 1,
        color: "#e4e4e7",
        backgroundColor: "#09090b",
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={
            link
              ? link
              : "https://img.freepik.com/premium-photo/abstract-mixed-shape-retro-vintage-color-style-background_176697-2700.jpg?w=360"
          }
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
            {message}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
