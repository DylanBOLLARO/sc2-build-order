import { Grid, Switch, Table, Modal } from "@nextui-org/react";
import { Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { ipcRenderer } from "electron";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiShow } from "react-icons/bi";

function BuildOrderAvailable({ data, handleDataAdded, allCategories }) {
  const router = useRouter();
  const { query } = useRouter();

  const [selectedCategories, setSelectedCategories] = useState([]);

  // const [selectedItem, setSelectedItem] = useState(null);
  const [visible, setVisible] = useState({ visible: false, title: "" });

  const updateState = (visible, title) => {
    setVisible({ visible, title });
  };

  const closeHandler = () => {
    setVisible({ visible: false, title: "" });
    console.log("closed");
  };

  const handler = (text) => {
    updateState(true, text);
  };

  useEffect(() => {
    console.log("Composant played data-added");

    // Abonnez-vous à l'événement de données ajoutées
    ipcRenderer.on("data-added", handleDataAdded);

    return () => {
      // Nettoyage de l'abonnement à l'événement lors du démontage du composant
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
        open={visible.visible}
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
          <Button auto flat color="error" onPress={closeHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <p className="w-full py-4 text-left font-mono text-lg">
        List of all build order available
      </p>
      <div className="w-full">
        <Grid.Container
          gap={2}
          css={{ width: "100%", justifyContent: "center" }}
        >
          {allCategories &&
            allCategories.map((category) => {
              return (
                <Grid>
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
                                  selectedCategories: selectedCategories,
                                  title: row.title,
                                },
                              });
                            }}
                          >
                            <div className="rounded-lg text-[#61afe4] duration-75 hover:bg-zinc-200">
                              <BiShow size={28} />
                            </div>
                          </button>
                          <button onClick={() => handler(row.title)}>
                            <div className="rounded-lg text-[#e06c75] duration-75 hover:bg-zinc-200">
                              <AiFillDelete size={28} />
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
