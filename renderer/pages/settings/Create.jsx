import { useState, useEffect } from "react";
import { Grid, Radio } from "@nextui-org/react";
import { ipcRenderer } from "electron";

import { useRouter } from "next/router";
import LayoutSettings from "../../components/settings/LayoutSettings";
import { Box, Button, TextField } from "@mui/material";
import ToggleButtons from "../../components/settings/ToggleButtons";

const CreateNewBuildOrder = ({ handleDataAdded }) => {
  const router = useRouter();
  const [racePlay, setRacePlay] = useState("");
  const [raceVersus, setRaceVersus] = useState("");
  const [localBuild, setLocalBuild] = useState({
    title: "",
    playrace: "",
    versusrace: "",
  });

  const checkingFieldsOfBuild = (localBuild) => {
    if (localBuild.title === "" || localBuild.category === "") {
      return false;
    } else {
      return true;
    }
  };

  const handleRacePlay = (event, newAlignment) => {
    setRacePlay(newAlignment);
    updateLocalBuild("playrace", newAlignment);
  };

  const handleRaceVersus = (event, newAlignment) => {
    setRaceVersus(newAlignment);
    updateLocalBuild("versusrace", newAlignment);
  };

  const updateLocalBuild = (field, value) => {
    setLocalBuild((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleFormSubmit = async () => {
    if (checkingFieldsOfBuild(localBuild)) {
      try {
        await ipcRenderer.invoke("add-data-to-db", {
          title: localBuild.title,
          playrace: localBuild.playrace,
          versusrace: localBuild.versusrace,
        });

        updateLocalBuild("title", "");

        handleDataAdded();
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    console.log(localBuild);
  }, [localBuild]);

  return (
    <LayoutSettings title={"Create new build order"}>
      <div className="flex w-full flex-col items-center gap-5 px-10 py-5 text-xl">
        <div className="flex flex-row items-center gap-5 text-zinc-300">
          <Box component="div" sx={{ fontSize: 32, width: "250px" }}>
            Race play :
          </Box>
          <ToggleButtons handleAlignment={handleRacePlay} value={racePlay} />
        </div>
        <div className="flex flex-row items-center gap-5 text-zinc-300">
          <Box component="div" sx={{ fontSize: 32, width: "250px" }}>
            Race versus :
          </Box>
          <ToggleButtons
            handleAlignment={handleRaceVersus}
            value={raceVersus}
          />
        </div>
        <div className="flex w-full justify-between gap-5">
          <TextField
            sx={{ width: "70%" }}
            id="outlined-basic"
            label="Name of your build order"
            variant="outlined"
            onChange={(e) => updateLocalBuild("title", e.target.value)}
            value={localBuild.title}
          />
          <Button
            variant="outlined"
            onClick={handleFormSubmit}
            sx={{ width: "30%" }}
          >
            Insert build
          </Button>
        </div>
      </div>
    </LayoutSettings>
  );
};

export default CreateNewBuildOrder;
