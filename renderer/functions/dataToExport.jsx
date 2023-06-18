import { ipcRenderer } from "electron";
import React from "react";

async function dataToExport(title, data) {
  const jsonData = {
    buildOrder: data,
    title: title,
  };

  ipcRenderer.send("export-json", jsonData);

  ipcRenderer.on("export-json-reply", (event, data) => {
    if (data.success) {
      alert("Le fichier JSON a été exporté avec succès !");
    } else {
      alert("Erreur lors de l'exportation du fichier JSON.");
    }
  });
}

export default dataToExport;
