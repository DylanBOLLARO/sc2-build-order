import { dialog, BrowserWindow } from "electron";
import fs from "fs";
import * as path from "path";
import * as sqlite3 from "sqlite3";

export async function importJSON(
  mainWindow: BrowserWindow,
  settingsWindow: BrowserWindow
) {
  const filePath = dialog.showOpenDialogSync(mainWindow);
  const dbFilePath = path.join(__dirname, "database");

  const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    console.log("Connected to the SQLite database");
  });

  fs.readFile;
  if (filePath) {
    fs.readFile(filePath[0], "utf8", (err, data) => {
      if (err) throw err;
      console.log("build imported : " + data);
      console.log("JSON.parse(data).title : " + JSON.parse(data).title);

      const { title, category } = JSON.parse(data);

      db.run(
        "INSERT INTO build_order (title, category_id) VALUES (?, ?);",
        [title, 1],
        function (err) {
          if (err) {
            console.error(err);
            return;
          }

          const idBuild = this.lastID;
          console.log("buildOrderId : " + idBuild);
          console.log("title : " + title, "category : " + category);

          JSON.parse(data).buildOrder.forEach((buildOrder) => {
            console.log(JSON.stringify(buildOrder));
            console.log("number of my id : " + idBuild);

            db.run(
              "INSERT INTO etapes (timer, population, content, build_order_id) VALUES (?, ?, ?, ?);",
              [
                buildOrder.timer,
                buildOrder.population,
                buildOrder.content,
                idBuild,
              ],
              function (err) {
                if (err) {
                  console.error(err);
                  return;
                }

                console.log("success");
                settingsWindow.webContents.send("data-added");
              }
            );
          });
        }
      );
    });
  }
}
