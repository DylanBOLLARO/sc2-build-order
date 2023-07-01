import Header from "./Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const LayoutSettings = ({ children }) => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <>
      <Header />
      <ThemeProvider theme={darkTheme}>
        <main className="mt-24">{children}</main>
      </ThemeProvider>
    </>
  );
};

export default LayoutSettings;
