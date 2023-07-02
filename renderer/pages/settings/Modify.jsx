import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import LayoutSettings from "../../components/settings/LayoutSettings";
import { Button, TextField } from "@mui/material";
import BasicTable from "../../components/settings/BasicTable";
import { ipcRenderer } from "electron";

function ViewAndChange() {
  const router = useRouter();
  const { query } = useRouter();

  const [dataAdded, setDataAdded] = useState(false);
  const [data, setData] = useState([]);
  const [localBuildOrder, setLocalBuildOrder] = useState({
    timer: null,
    population: null,
    description: null,
    build_order_id: query.id,
  });

  const updateLocalBuild = (field, value) => {
    setLocalBuildOrder((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  function checkObjectProperties(obj) {
    for (let key in obj) {
      if (obj[key] !== null) {
        return true;
      }
    }
    return false;
  }

  const handleDataAdded = () => {
    console.log("handleDataAdded");
    setDataAdded(true);
  };

  useEffect(() => {
    console.log("buildData : " + JSON.stringify(query.test));

    (async () => {
      try {
        const newData = await ipcRenderer.invoke(
          "db-query",
          `SELECT * FROM etapes WHERE build_order_id=${query.test};`
        );
        if (data !== newData) {
          setData(newData);
          console.log("data : " + JSON.stringify(newData));
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleFormSubmit = async () => {
    try {
      await ipcRenderer.invoke("add-line-build-order-to-db", {
        timer: parseInt(localBuildOrder.timer),
        population: parseInt(localBuildOrder.population),
        content: localBuildOrder.description,
        build_order_id: parseInt(query.test),
      });

      console.log("localBuildOrder : " + JSON.stringify(localBuildOrder));
      handleDataAdded();
    } catch (error) {
      console.error(error);
    }
    updateLineOfBuild();
  };

  useEffect(() => {
    ipcRenderer.on("data-line-added", handleDataAdded);
    return () => {
      ipcRenderer.off("data-line-added", handleDataAdded);
    };
  }, []);

  const updateLineOfBuild = () => {
    (async () => {
      try {
        const newData = await ipcRenderer.invoke(
          "db-query",
          `SELECT * FROM etapes WHERE build_order_id=${query.test};`
        );
        setData(newData);
        console.log("data : " + JSON.stringify(newData));
      } catch (error) {
        console.error(error);
      }
    })();
  };

  useEffect(() => {
    updateLineOfBuild();
    console.log("data : " + JSON.stringify(data));
  }, [dataAdded]);

  return (
    <div className="m-0 p-0">
      <LayoutSettings title={"Modify build order"}>
        <div className="m-5 flex flex-col gap-5">
          <div className="flex flex-row justify-between">
            <Button
              sx={{ width: "200px" }}
              variant="outlined"
              onClick={() => {
                router.push({
                  pathname: "/settings/Show",
                });
              }}
            >
              Back
            </Button>
            <Button
              sx={{ width: "200px" }}
              variant="outlined"
              color="success"
              auto
              ghost
              // onClick={handleFormSubmit}
            >
              Export
            </Button>
          </div>
          {/* <Text
            h1
            size={60}
            css={{
              textGradient: "45deg, $blue600 -20%, $pink600 50%",
              textAlign: "center",
            }}
            weight="bold"
          >
            {query.title}
          </Text> */}
          <BasicTable data={data} local={localBuildOrder} />
          {/* <div>
            <Table
              bordered
              shadow={false}
              selectionMode="multiple"
              aria-label="Example static bordered collection table"
              css={{
                height: "auto",
                minWidth: "100%",
              }}
            >
              <Table.Header>
                <Table.Column>Line</Table.Column>
                <Table.Column>Population</Table.Column>
                <Table.Column>Timer</Table.Column>
                <Table.Column>Description</Table.Column>
                <Table.Column>Options</Table.Column>
              </Table.Header>
              <Table.Body>
                {data.map((item, index) => {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{item.population}</Table.Cell>
                      <Table.Cell>{item.timer}</Table.Cell>
                      <Table.Cell>{item.content}</Table.Cell>

                      <Table.Cell>
                        <div className="flex flex-row justify-center gap-3">
                          <button
                            onClick={async () => {
                              console.log("pressed");
                              console.log("id etapes :" + item.id);
                              console.log("id build order :" + query.id);

                              try {
                                const newData = await ipcRenderer.invoke(
                                  "db-query",
                                  `DELETE FROM etapes WHERE build_order_id=${query.id} AND id=${item.id};`
                                );
                                updateLineOfBuild();

                                console.log(
                                  "data : " + JSON.stringify(newData)
                                );
                              } catch (error) {
                                console.error(error);
                              }
                            }}
                          >
                            <div className="rounded-lg text-[#e06c75] duration-75 hover:bg-zinc-200">
                              <AiFillDelete size={28} />
                            </div>
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}

                {checkObjectProperties(localBuildOrder) && (
                  <Table.Row
                    key={localBuildOrder.timer}
                    css={{ backgroundColor: "#c6ff9e" }}
                  >
                    <Table.Cell></Table.Cell>
                    <Table.Cell>{localBuildOrder.population}</Table.Cell>
                    <Table.Cell>{localBuildOrder.timer}</Table.Cell>
                    <Table.Cell>{localBuildOrder.description}</Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div> */}
          <div className="flex flex-row justify-between">
            <TextField
              id="Description-basic"
              label="Description"
              variant="outlined"
              onChange={(e) => {
                updateLocalBuild("description", e.target.value);
              }}
            />
            <TextField
              id="Population-basic"
              label="Population"
              variant="outlined"
              onChange={(e) => {
                updateLocalBuild("population", e.target.value);
              }}
            />
            <TextField
              id="Timer-basic"
              label="Timer"
              variant="outlined"
              onChange={(e) => {
                updateLocalBuild("timer", e.target.value);
              }}
            />

            <Button
              variant="outlined"
              color="secondary"
              auto
              ghost
              onClick={handleFormSubmit}
            >
              Save line
            </Button>
          </div>
        </div>
      </LayoutSettings>
    </div>
  );
}

export default ViewAndChange;
