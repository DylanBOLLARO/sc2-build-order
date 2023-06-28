import Header from "./Header";

const LayoutSettings = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default LayoutSettings;
