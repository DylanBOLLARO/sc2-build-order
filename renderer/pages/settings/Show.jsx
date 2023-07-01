// import { Grid, Switch, Table, Modal } from "@nextui-org/react";
// import { Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { Button, Card } from "@nextui-org/react";

import { ipcRenderer } from "electron";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LayoutSettings from "../../components/settings/LayoutSettings";
import ActionAreaCard2 from "../../components/Card2";
import BasicSelect from "../../components/BasicSelect";

function Show() {
  const router = useRouter();
  const { query } = useRouter();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [targetId, setTargetId] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [data, setData] = useState(null);
  const [dataAdded, setDataAdded] = useState(false);

  const [raceBuildDisplayed, setRaceBuildDisplayed] = useState(3);

  const handleDataAdded = () => {
    console.log("handleDataAdded");
    setDataAdded(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const newData = await ipcRenderer.invoke(
          "db-query",
          "SELECT * FROM build_order;"
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

  useEffect(() => {
    console.log("raceBuildDisplayed : " + JSON.stringify(raceBuildDisplayed));
  }, [raceBuildDisplayed]);

  useEffect(() => {
    ipcRenderer.on("data-added", handleDataAdded);
    return () => {
      ipcRenderer.off("data-added", handleDataAdded);
    };
  }, []);

  return (
    <LayoutSettings title={"List of all build order"}>
      <div className="m-8 flex items-center justify-center gap-5 font-mono text-2xl font-bold text-zinc-300">
        <BasicSelect
          raceBuildDisplayed={raceBuildDisplayed}
          setRaceBuildDisplayed={setRaceBuildDisplayed}
        />
        {/* <p>VS</p> */}
        {/* <BasicSelect
          raceBuildDisplayed={raceBuildDisplayed}
          setRaceBuildDisplayed={setRaceBuildDisplayed}
        /> */}
      </div>
      <div className="m-3 flex flex-wrap justify-center gap-5">
        {data
          ?.filter((race) => {
            if (raceBuildDisplayed === 3) {
              return true;
            }
            return race.playrace == raceBuildDisplayed;
          })
          .map((build, index) => (
            <ActionAreaCard2 key={index} buildData={build} />
          ))}
      </div>
    </LayoutSettings>
  );
}

export default Show;
