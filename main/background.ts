import { BrowserWindow, app, globalShortcut, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import * as sqlite3 from "sqlite3";
import * as path from "path";
import * as fs from "fs";
import { exportJSON } from "./functions/exportJSON";
import { importJSON } from "./functions/importJSON";
import { databaseCreation } from "./functions/databaseCreation";

const customPathMain = path.join(app.getAppPath(), "main");
const isProd = process.env.NODE_ENV === "production";

let mainWindow: BrowserWindow,
  settingsWindow: BrowserWindow,
  dbFilePath: string = null;

(async () => {
  if (!fs.existsSync(customPathMain + "/db")) {
    await fs.promises.mkdir(customPathMain + "/db", { recursive: true });
  }
  dbFilePath = path.join(customPathMain + "/db", "database");
})();

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 400,
    height: 800,
    x: 0,
    y: 0,
    fullscreen: false,
    resizable: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
  });

  settingsWindow = createWindow("settings", {
    title: "Settings",
    maximizable: true,
    width: 1200,
    height: 800,
    minHeight: 500,
    minWidth: 700,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#27272a",
  });

  settingsWindow.center();

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
    await settingsWindow.loadURL("app://./settings.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    await settingsWindow.loadURL(`http://localhost:${port}/settings`);
    mainWindow.webContents.openDevTools();
    settingsWindow.webContents.openDevTools();
  }

  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
  }

  ipcMain.on("show-settings", () => {
    globalShortcut.unregisterAll();
    settingsWindow.show();
  });

  // Attribution des shortcuts
  const [openSettings, hide, one, two, tree] = [
    "Ctrl+Shift+A",
    "num6",
    "num7",
    "num8",
    "num9",
  ];

  const arrayGlobalShortcut = [openSettings, hide, one, two, tree];

  function registerGlobalShortcut(key) {
    globalShortcut.register(key, () => {
      mainWindow.webContents.send(key);
    });
  }

  settingsWindow.on("close", (event) => {
    event.preventDefault();
    settingsWindow.hide();
    arrayGlobalShortcut.map((shortcut) => registerGlobalShortcut(shortcut));
  });

  arrayGlobalShortcut.map((shortcut) => registerGlobalShortcut(shortcut));

  const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    console.log("Connected to the SQLite database");
  });

  databaseCreation(db);

  ipcMain.handle("db-query", async (event, sqlQuery) => {
    return new Promise((resolve, reject) => {
      db.all(sqlQuery, (err, rows) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle("get-all-categories", async (event, sqlQuery) => {
    return new Promise((resolve, reject) => {
      db.all(sqlQuery, (err, rows) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      });
    });
  });

  ipcMain.on("delete-line", (event, params) => {
    const { param1, param2 } = params;

    db.run("DELETE FROM Etapes WHERE ID = ?", param1, function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Ligne avec l'ID ${param1} supprimée de la table recette`);
      }
    });
  });

  ipcMain.handle("add-data-to-db", async (event, data) => {
    return new Promise((resolve, reject) => {
      const { title, category } = data;
      db.run(
        "INSERT INTO build_order (title, category_id) VALUES (?, ?);",
        [title, category],
        function (err) {
          if (err) {
            reject(err.message);
          } else {
            console.log("title : " + title, "category : " + category);
            settingsWindow.webContents.send("data-added");
            resolve({ success: true, message: "Data added successfully" });
          }
        }
      );
    });
  });

  ipcMain.handle("add-line-build-order-to-db", async (event, data) => {
    return new Promise((resolve, reject) => {
      const { timer, population, content, build_order_id } = data;
      db.run(
        "INSERT INTO etapes (timer, population,content,build_order_id  ) VALUES (?, ?,?,?);",
        [timer, population, content, build_order_id],
        function (err) {
          if (err) {
            console.log("fail");
            reject(err.message);
          } else {
            console.log("succes");
            settingsWindow.webContents.send("data-line-added");
            resolve({ success: true, message: "Data added successfully" });
          }
        }
      );
    });
  });

  ipcMain.handle("patch-data-to-db", async (event, data) => {
    return new Promise((resolve, reject) => {
      const { name, description, temps } = data;
      db.run(
        "UPDATE Recettes SET (Nom, Description, Temps) VALUES (?, ?, ?)",
        [name, description, temps],
        function (err) {
          if (err) {
            reject(err.message);
          } else {
            console.log(name, description, temps);
            mainWindow.webContents.emit("data-pactched");
            resolve({ success: true, message: "Data pactched successfully" });
          }
        }
      );
    });
  });
})();

// Export JSON file
ipcMain.on("export-json", (event, jsonData) => {
  exportJSON(mainWindow, jsonData);
});

// Import JSON file
ipcMain.on("import-json", (event) => {
  importJSON(mainWindow, settingsWindow);
});

app.on("window-all-closed", () => {
  app.quit();
});
