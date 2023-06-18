import { ipcRenderer } from "electron";
import React from "react";

async function dataToImport() {
  ipcRenderer.send("import-json");
}

export default dataToImport;
