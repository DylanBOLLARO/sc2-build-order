import { ipcRenderer } from "electron";
import { Modal } from "@nextui-org/react";

async function dataToImport() {
  ipcRenderer.send("import-json");
}

export default dataToImport;
