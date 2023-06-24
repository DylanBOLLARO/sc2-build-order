import { ipcRenderer } from "electron";

async function dataToExport(title, data, category) {
  const jsonData = {
    buildOrder: data,
    category: category,
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
