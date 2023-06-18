import { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Input,
  Radio,
  Spacer,
  Switch,
  Table,
} from "@nextui-org/react";
import { ipcRenderer } from "electron";

const CreateNewBuildOrder = ({
  handleDataAdded,
  localBuild,
  setLocalBuild,
  allCategories,
}) => {
  useEffect(() => {
    console.log(localBuild);
  }, [localBuild]);

  const checkingFieldsOfBuild = (localBuild) => {
    if (localBuild.title === "" || localBuild.category === "") {
      return false;
    } else {
      return true;
    }
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
          category: localBuild.category + 1,
        });

        updateLocalBuild("title", "");

        handleDataAdded();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const [checked, setChecked] = useState("");

  return (
    <div className="flex w-screen flex-col items-center px-10 text-xl">
      <p className="w-full py-4 text-left font-mono text-lg">
        Create new build order
      </p>
      <div className="w-full py-4">
        <Grid.Container
          gap={2}
          css={{ width: "100%", justifyContent: "center" }}
        >
          <Radio.Group
            aria-label="Choose a category"
            value={checked}
            onChange={(e) => {
              setChecked(e);
              updateLocalBuild(
                "category",
                allCategories.findIndex((item) => item.title === e)
              );
            }}
            orientation={"horizontal"}
            color="success"
          >
            {allCategories &&
              allCategories.map((category, index) => {
                return (
                  <Radio isSquared value={category.title} key={index}>
                    {category.title}
                  </Radio>
                );
              })}
          </Radio.Group>
        </Grid.Container>
      </div>
      <div className="flex w-full flex-row justify-between gap-5 pb-5">
        <Input
          css={{ width: "100%" }}
          placeholder="Name of your build order"
          value={localBuild.title}
          onChange={(e) => updateLocalBuild("title", e.target.value)}
          size="xl"
          aria-label="Nom input"
        />
        <Button
          size="lg"
          type="submit"
          color={"success"}
          flat
          aria-label="Add build order button"
          onPress={handleFormSubmit}
        >
          Insert build
        </Button>
      </div>
    </div>
  );
};

export default CreateNewBuildOrder;
