import { useEffect, useState } from "react";
import BuildOrderAvailable from "../components/settings/BuildOrderAvailable";
import CreateNewBuildOrder from "../components/settings/CreateNewBuildOrder";
import LayoutSettings from "../components/settings/LayoutSettings";
import { ipcRenderer } from "electron";

const settings = () => {
  const [dataAdded, setDataAdded] = useState(false);
  const [data, setData] = useState("");
  const [localBuild, setLocalBuild] = useState({
    title: "",
    category: "",
  });

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

  const handleDataAdded = () => {
    console.log("handleDataAdded");
    setDataAdded(true);
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

  const [allCategories, setAllCategories] = useState(null);

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

  return (
    <div className="m-0 min-h-screen bg-white p-0">
      <LayoutSettings>
        <div className="flex flex-col gap-10">
          <BuildOrderAvailable
            data={data}
            handleDataAdded={handleDataAdded}
            allCategories={allCategories}
          />
          <CreateNewBuildOrder
            handleDataAdded={handleDataAdded}
            localBuild={localBuild}
            setLocalBuild={setLocalBuild}
            allCategories={allCategories}
          />
        </div>
      </LayoutSettings>
    </div>
  );
};

export default settings;
