// import { Grid, Switch, Table, Modal } from "@nextui-org/react";
// import { Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

import { ipcRenderer } from "electron";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";
import dataToExport from "../../functions/dataToExport";
import dataToImport from "../../functions/dataToImport";
import LayoutSettings from "../../components/settings/LayoutSettings";
import AlertDialog from "../../components/AlertDialog";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function BuildOrderAvailable() {
  const router = useRouter();
  const { query } = useRouter();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [data, setData] = useState(null);
  const [dataAdded, setDataAdded] = useState(false);

  const handleDataAdded = () => {
    console.log("handleDataAdded");
    setDataAdded(true);
  };

  const race = ["Terran", "Zerg", "Protoss", "All"];

  useEffect(() => {
    (async () => {
      try {
        const newData = await ipcRenderer.invoke(
          "db-query",
          "SELECT r.id, r.title, c.title AS category FROM build_order r JOIN categories c ON c.id = r.category_id;"
        );
        if (data !== newData) {
          setData(newData);
          console.log("data : " + JSON.stringify(newData));
        }
      } catch (error) {
        console.error(error);
      }
    })();

    if (dataAdded) {
      setDataAdded(false);
    }
  }, [dataAdded]);

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  useEffect(() => {
    (async () => {
      try {
        setAllCategories(
          await ipcRenderer.invoke(
            "get-all-categories",
            "SELECT title FROM categories;"
          )
        );
        console.log("allCategories : " + JSON.stringify(allCategories));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const closeHandler = async () => {
    setVisible(false);
    setVisible2(false);
    console.log("closed");
  };

  const deleteHandler = async () => {
    setVisible(false);
    console.log("deleted");

    try {
      const newData = await ipcRenderer.invoke(
        "db-query",
        `DELETE FROM build_order WHERE id=${targetId};`
      );
      console.log("data : " + JSON.stringify(newData));
    } catch (error) {
      console.error(error);
    }

    handleDataAdded();
  };

  useEffect(() => {
    ipcRenderer.on("data-added", handleDataAdded);
    return () => {
      ipcRenderer.off("data-added", handleDataAdded);
    };
  }, []);

  useEffect(() => {
    console.log(
      "query.selectedCategories : " + JSON.stringify(query.selectedCategories)
    );
    console.log("selectedCategories : " + JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  const arrayAddElement = (str) => {
    setSelectedCategories([...selectedCategories, str]);
  };

  const arrayDeleteElement = (str) => {
    setSelectedCategories(selectedCategories.filter((item) => item !== str));
  };

  const handleSwitchChange = (categoryTitle, value) => {
    if (value.target.checked) {
      arrayAddElement(categoryTitle);
    } else {
      arrayDeleteElement(categoryTitle);
    }
  };
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <LayoutSettings title={"List of all build order"}>
      <div className="flex h-full w-screen flex-col items-center gap-5 px-10 py-5 text-xl">
        {/* <Modal
          blur
          animated
          preventClose
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id="modal-title" weight={"bold"} size={22}>
              Delete build order ?
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Row justify="space-between">
              <Text>
                Are you sure you want to permanently delete this build order ?
              </Text>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button auto onPress={closeHandler}>
              Cancel
            </Button>
            <Button auto flat color="error" onPress={deleteHandler}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          closeButton
          aria-labelledby="modal-title"
          open={visible2}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Welcome to
              <Text b size={18}>
                NextUI
              </Text>
            </Text>
          </Modal.Header>
        </Modal> */}

        <ThemeProvider theme={darkTheme}>
          <AlertDialog title={"Chose race"} selectionOne={race} />
        </ThemeProvider>

        {/* <div className="w-full text-white">
          <Grid.Container
            gap={2}
            css={{ width: "100%", justifyContent: "center", color: "black" }}
          >


            {allCategories &&
              allCategories.map((category, index) => {
                return (
                  <Grid key={index}>
                    <p className="text-center">{category.title}</p>
                    <Switch
                      css={{
                        background: "$gray800", // colors.gray800
                        color: "$gray100",
                      }}
                      checked={false}
                      onChange={(value) =>
                        handleSwitchChange(category.title, value)
                      }
                    />
                  </Grid>
                );
              })}
          </Grid.Container>
        </div> */}
        <div className="w-full">
          <TableContainer
            component={Paper}
            sx={{ background: "#18181b", borderRadius: 2 }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#e4e4e7" }}>id</TableCell>
                  <TableCell sx={{ color: "#e4e4e7" }} align="right">
                    title
                  </TableCell>
                  <TableCell sx={{ color: "#e4e4e7" }} align="right">
                    category
                  </TableCell>
                  <TableCell sx={{ color: "#e4e4e7" }} align="right">
                    Options
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  ?.filter((category) =>
                    selectedCategories.includes(category.category)
                  )
                  .map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <Table.Cell component="th" scope="row">
                        {row.id}
                      </Table.Cell>
                      <Table.Cell align="right">{row.title}</Table.Cell>
                      <Table.Cell align="right">{row.category}</Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-row justify-center gap-3">
                          <button
                            onClick={() => {
                              router.push({
                                pathname: "/settings/Modify",
                                query: {
                                  title: row.title,
                                  id: row.id,
                                },
                              });
                            }}
                          >
                            <div className="rounded-lg text-[#61afe4] duration-75 hover:bg-zinc-200">
                              <BiShow size={28} />
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setVisible(true);
                              setTargetId(row.id);
                            }}
                          >
                            <div className="rounded-lg text-[#e06c75] duration-75 hover:bg-zinc-200">
                              <AiFillDelete size={28} />
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              console.log("row : " + JSON.stringify(row));
                              (async () => {
                                try {
                                  const newData = await ipcRenderer.invoke(
                                    "db-query",
                                    `SELECT * FROM etapes WHERE build_order_id=${row.id};`
                                  );
                                  dataToExport(
                                    row.title,
                                    newData,
                                    row.category
                                  );
                                } catch (error) {
                                  console.error(error);
                                }
                              })();
                            }}
                          >
                            <div className="rounded-lg text-[#61afe4] duration-75 hover:bg-zinc-200">
                              <BsFillArrowUpRightSquareFill
                                size={24}
                                color="#89be79"
                              />
                            </div>
                          </button>
                        </div>
                      </Table.Cell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* {data && (
            <Table
              compact
              aria-label="Example table with dynamic content"
              css={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Table.Header>
                <Table.Column
                  css={{ fontSize: 16, width: "10%", textAlign: "center" }}
                >
                  id
                </Table.Column>
                <Table.Column
                  css={{ fontSize: 16, width: "60%", textAlign: "center" }}
                >
                  title
                </Table.Column>
                <Table.Column
                  css={{ fontSize: 16, width: "15%", textAlign: "center" }}
                >
                  category
                </Table.Column>
                <Table.Column
                  css={{ fontSize: 16, width: "15%", textAlign: "center" }}
                >
                  Options
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {data
                  .filter((category) =>
                    selectedCategories.includes(category.category)
                  )
                  .map((row, index) => {
                    return (
                      <Table.Row
                        key={index}
                        css={{ fontSize: "$xl", fontFamily: "$mono" }}
                      >
                        <Table.Cell>{row.id}</Table.Cell>
                        <Table.Cell>{row.title}</Table.Cell>
                        <Table.Cell>{row.category}</Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-row justify-center gap-3">
                            <button
                              onClick={() => {
                                router.push({
                                  pathname: "/settings/Modify",
                                  query: {
                                    title: row.title,
                                    id: row.id,
                                  },
                                });
                              }}
                            >
                              <div className="rounded-lg text-[#61afe4] duration-75 hover:bg-zinc-200">
                                <BiShow size={28} />
                              </div>
                            </button>
                            <button
                              onClick={() => {
                                setVisible(true);
                                setTargetId(row.id);
                              }}
                            >
                              <div className="rounded-lg text-[#e06c75] duration-75 hover:bg-zinc-200">
                                <AiFillDelete size={28} />
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                console.log("row : " + JSON.stringify(row));
                                (async () => {
                                  try {
                                    const newData = await ipcRenderer.invoke(
                                      "db-query",
                                      `SELECT * FROM etapes WHERE build_order_id=${row.id};`
                                    );
                                    dataToExport(
                                      row.title,
                                      newData,
                                      row.category
                                    );
                                  } catch (error) {
                                    console.error(error);
                                  }
                                })();
                              }}
                            >
                              <div className="rounded-lg text-[#61afe4] duration-75 hover:bg-zinc-200">
                                <BsFillArrowUpRightSquareFill
                                  size={24}
                                  color="#89be79"
                                />
                              </div>
                            </button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
              </Table.Body>
            </Table>
          )} */}
        </div>
        <Button
          onPress={() => {
            router.push({
              pathname: "/settings",
              query: {},
            });
          }}
        >
          Back
        </Button>
      </div>
    </LayoutSettings>
  );
}

export default BuildOrderAvailable;
