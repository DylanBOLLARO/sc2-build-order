import { Card, Text, Grid, cssNoBlurriness } from "@nextui-org/react";

export const Card5 = ({ title, link, toDo }) => (
  <Grid xs={12} sm={6} key={title}>
    <Card
      isPressable
      isHoverable
      onPress={toDo}
      css={{
        border: "solid",
        borderRadius: "20px",
        filter: "grayscale(50%)",
        transitionDuration: 1000,
        "&:hover": {
          filter: "grayscale(10%)",
        },
      }}
    >
      <Card.Body
        css={{
          padding: 0,
        }}
      >
        <Card.Image
          src={link}
          objectFit="cover"
          width="100%"
          height={140}
          alt={title}
        />
      </Card.Body>
      <Card.Footer
        isBlurred
        css={{
          position: "absolute",
          bgBlur: "#0f1114AA",
          borderTop: "$borderWeights$light solid black",
          bottom: 0,
          zIndex: 1,
          height: "30%",
          borderRadius: "0",
        }}
      >
        <Text
          css={{
            color: "#9E9E9E",
            textAlign: "center",
            alignItems: "center",
            width: "100%",
          }}
          size={22}
          weight="bold"
          transform="uppercase"
        >
          {title}
        </Text>
      </Card.Footer>
    </Card>
  </Grid>
);
