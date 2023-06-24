import { dialog, BrowserWindow } from "electron";
import fs from "fs";

export function exportJSON(mainWindow: BrowserWindow, jsonData: any) {
  console.log("jsonData : " + JSON.stringify(jsonData));

  const filePath = dialog.showSaveDialogSync(mainWindow, {
    title: jsonData.title,
    defaultPath: jsonData.title.trim().replace(/\s/g, ""),
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (filePath) {
    const jsonString = JSON.stringify(jsonData);

    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        mainWindow.webContents.send("export-json-reply", { success: false });
      } else {
        console.log("JSON file exported successfully:", filePath);
        mainWindow.webContents.send("export-json-reply", { success: true });
      }
    });
  } else {
    mainWindow.webContents.send("export-json-reply", { success: false });
  }
}
