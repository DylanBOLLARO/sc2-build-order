import { useEffect, useState } from "react";
import LayoutSettings from "../components/settings/LayoutSettings";
import { ipcRenderer } from "electron";
import { Button, Card, Col, Grid, Image, Row, Text } from "@nextui-org/react";
import { Card5 } from "../components/Card5";
import dataToImport from "../functions/dataToImport";
import { useRouter } from "next/router";
import ActionAreaCard from "../components/Card";

const settings = () => {
  const router = useRouter();

  const [dataAdded, setDataAdded] = useState(false);
  const [data, setData] = useState(null);
  const [allCategories, setAllCategories] = useState(null);

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
    <div className="m-0 min-h-screen p-0">
      <LayoutSettings title={"Settings"}>
        <div className="m-3 flex flex-wrap justify-center gap-5">
          <ActionAreaCard
            title={"Show your build"}
            link={
              "https://c4.wallpaperflare.com/wallpaper/310/317/123/starcraft-ii-4k-hd-latest-wallpaper-preview.jpg"
            }
            toDo={() => {
              router.push({
                pathname: "/settings/Show",
                query: {},
              });
            }}
          />
          <ActionAreaCard
            title={"Create your build"}
            link={"https://wallpapers.com/images/featured/tbrha3aoagau52xz.jpg"}
            toDo={() => {
              router.push({
                pathname: "/settings/Create",
                query: {},
              });
            }}
          />

          <ActionAreaCard
            title={"Import your build"}
            link={
              "https://www.s-ge.com/sites/default/files/styles/sge_header_lg/public/publication/images/e-commerce.jpg?itok=2T87UuIH"
            }
            toDo={dataToImport}
          />
        </div>
      </LayoutSettings>
    </div>
  );
};

export default settings;
