import { Grid, Switch, Table, Modal } from "@nextui-org/react";
import { Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { ipcRenderer } from "electron";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";
import dataToExport from "../../functions/dataToExport";
import dataToImport from "../../functions/dataToImport";

function BuildOrderAvailable({ data, handleDataAdded, allCategories }) {
  const router = useRouter();
  const { query } = useRouter();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [targetId, setTargetId] = useState(null);

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

  return (
    <div className="flex w-screen flex-col items-center px-10 text-xl">
      <Modal
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
      </Modal>

      <div className="flex w-full flex-row justify-between py-4">
        <p className="w-full text-left font-mono text-lg">
          List of all build order available
        </p>

        <Button
          color={"secondary"}
          flat
          onPress={() => {
            dataToImport();
            setVisible2(true);
          }}
        >
          Import build
        </Button>
      </div>

      <div className="w-full">
        <Grid.Container
          gap={2}
          css={{ width: "100%", justifyContent: "center" }}
        >
          {allCategories &&
            allCategories.map((category, index) => {
              return (
                <Grid key={index}>
                  <p className="text-center">{category.title}</p>
                  <Switch
                    color={"default"}
                    checked={false}
                    size="sm"
                    onChange={(value) =>
                      handleSwitchChange(category.title, value)
                    }
                  />
                </Grid>
              );
            })}
        </Grid.Container>
      </div>
      <div className="w-full">
        {data && (
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
                                pathname: "/settings/ViewAndChange",
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
        )}
      </div>
    </div>
  );
}

export default BuildOrderAvailable;
