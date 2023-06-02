import React, { useState, useEffect } from "react";
import { Input, Dropdown, Table, Text, Button } from "@nextui-org/react";
import { ipcRenderer } from "electron";
import { AiFillEdit } from "react-icons/ai";

const sample = () => {
  const [showRowBuild, setshowRowBuild] = useState(false);
  const [localBuild, setLocalBuild] = useState({
    name: "",
    description: "",
    temps: "",
    nameBuild: "",
    line: "",
  });

  const updateLocalBuild = (field, value) => {
    setLocalBuild((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await ipcRenderer.invoke("add-data-to-db", {
        name: localBuild.name,
        description: localBuild.description,
        temps: localBuild.temps,
      });

      updateLocalBuild("name", "");
      updateLocalBuild("description", "");
      updateLocalBuild("temps", "");

      handleDataAdded();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateLocalBuild("line", data.length + 1);
    localBuild.name !== "" ||
    localBuild.temps !== "" ||
    localBuild.description !== ""
      ? setshowRowBuild(true)
      : setshowRowBuild(false);
  }, [localBuild]);

  const handleDataAdded = () => {
    setDataAdded(true);
  };

  const [data, setData] = useState("");
  const [dataAdded, setDataAdded] = useState(false);

  const [selected, setSelected] = React.useState(new Set(["Chose"]));

  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  const [selected2, setSelected2] = React.useState(new Set(["Chose"]));

  const selectedValue2 = React.useMemo(
    () => Array.from(selected2).join(", ").replaceAll("_", " "),
    [selected2]
  );

  useEffect(() => {
    (async () => {
      try {
        const newData = await ipcRenderer.invoke(
          "db-query",
          "SELECT ID, Nom, Description, Temps FROM Recettes"
        );
        if (data !== newData) {
          setData(newData);
          console.log("data : " + JSON.stringify(newData));
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [dataAdded]);

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
    if (dataAdded) {
      setDataAdded(false);
    }
  }, [dataAdded]);

  return (
    <>
      <div className="flex flex-col items-center gap-10 p-5 text-xl">
        <Text color="primary">List of all build order available</Text>
        <div className="flex flex-row">
          <Table
            aria-label="Example no animated collection table"
            animated={true}
            selectionMode="multiple"
            color="warning"
          >
            <Table.Header>
              <Table.Column>Terran</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row key="1">
                <Table.Cell>16 marines medic</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Table
            aria-label="Example no animated collection table"
            animated={true}
            selectionMode="multiple"
            color="secondary"
          >
            <Table.Header>
              <Table.Column>Zerg</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row key="1">
                <Table.Cell>Hatch First</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Table
            aria-label="Example no animated collection table"
            animated={true}
            selectionMode="multiple"
            color="primary"
          >
            <Table.Header>
              <Table.Column>Protoss</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row key="1">
                <Table.Cell>4 Gates</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
      <div className="h-[1px] w-full bg-black" />
      <div className="p-5 text-center text-xl">
        <Text color="primary">Create new build order</Text>
      </div>
      <div className="flex flex-row items-center gap-10 p-5 text-xl">
        <p className="text-xl">Chose your mathcup</p>
        <div className="flex flex-col">
          <Dropdown>
            <Dropdown.Button flat color="default" css={{ tt: "capitalize" }}>
              {selectedValue}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="default"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selected}
              onSelectionChange={setSelected}
            >
              <Dropdown.Item key="Terran">Terran</Dropdown.Item>
              <Dropdown.Item key="Zerg">Zerg</Dropdown.Item>
              <Dropdown.Item key="Protoss">Protoss</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <p className="text-center text-sm">You</p>
        </div>

        <p className="text-2xl">vs</p>
        <div className="flex flex-col">
          <Dropdown>
            <Dropdown.Button flat color="default" css={{ tt: "capitalize" }}>
              {selectedValue2}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="default"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selected2}
              onSelectionChange={setSelected2}
            >
              <Dropdown.Item key="Terran">Terran</Dropdown.Item>
              <Dropdown.Item key="Zerg">Zerg</Dropdown.Item>
              <Dropdown.Item key="Protoss">Protoss</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <p className="text-center text-sm">OpponentRace</p>
        </div>
        <div className="h-10 w-1 bg-black" />
        <Input
          size="xl"
          placeholder="Name of your build order"
          value={localBuild.nameBuild}
          onChange={(e) => updateLocalBuild("nameBuild", e.target.value)}
        />
      </div>

      <div className="flex flex-col p-5">
        <Table>
          <Table.Header>
            <Table.Column>Line</Table.Column>
            <Table.Column>Popuation</Table.Column>
            <Table.Column>Temps</Table.Column>
            <Table.Column>Description</Table.Column>
            <Table.Column>Settings</Table.Column>
          </Table.Header>

          <Table.Body>
            {Array.isArray(data) &&
              data.map((x, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{x.ID}</Table.Cell>
                    <Table.Cell>{x.Nom}</Table.Cell>
                    <Table.Cell>{x.Temps}</Table.Cell>
                    <Table.Cell>{x.Description}</Table.Cell>
                    <Table.Cell>
                      <Button
                        onClick={() => {
                          updateLocalBuild("name", "Hello");
                        }}
                      >
                        DELETE
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}

            {showRowBuild && (
              <Table.Row>
                <Table.Cell>{localBuild.line}</Table.Cell>
                <Table.Cell>{localBuild.name}</Table.Cell>
                <Table.Cell>{localBuild.temps}</Table.Cell>
                <Table.Cell>{localBuild.description}</Table.Cell>
                <Table.Cell>
                  <AiFillEdit />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-row justify-between py-3">
            <Input
              placeholder="Population"
              value={localBuild.name}
              onChange={(e) => updateLocalBuild("name", e.target.value)}
              size="xl"
            />
            <Input
              placeholder="Temps"
              value={localBuild.temps}
              onChange={(e) => updateLocalBuild("temps", e.target.value)}
              size="xl"
            />
            <Input
              placeholder="Description"
              value={localBuild.description}
              onChange={(e) => updateLocalBuild("description", e.target.value)}
              size="xl"
            />
            <Button size="lg" type="submit" color={"success"}>
              Add build order
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default sample;
