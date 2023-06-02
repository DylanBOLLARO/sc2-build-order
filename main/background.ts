import { app, globalShortcut, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import * as sqlite3 from "sqlite3";
import * as path from "path";

const dbFilePath = path.join(__dirname, "database");

const isProd = process.env.NODE_ENV === "production";

let mainWindow = null;
let sampleWindow = null;

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
    y: 50,
    fullscreen: false,
    resizable: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
  });

  sampleWindow = createWindow("sample", {
    parent: mainWindow,
    modal: true,
    width: 1500,
    height: 800,
    alwaysOnTop: true,
    show: false,
  });

  sampleWindow.center();

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
    await sampleWindow.loadURL("app://./sample.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    await sampleWindow.loadURL(`http://localhost:${port}/sample`);
    mainWindow.webContents.openDevTools();
    sampleWindow.webContents.openDevTools();
  }

  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(false, { forward: false });
  }

  ipcMain.on("show-sample", () => {
    sampleWindow.show();
  });

  sampleWindow.on("close", (event) => {
    event.preventDefault();
    sampleWindow.hide();
  });

  globalShortcut.register("num7", () => {
    mainWindow.webContents.send("num7", "Touche num7");
  });

  globalShortcut.register("num8", () => {
    mainWindow.webContents.send("num8", "Touche num8");
  });

  globalShortcut.register("num9", () => {
    mainWindow.webContents.send("num9", "Touche num9");
  });

  globalShortcut.register("num5", () => {
    mainWindow.webContents.send("num5", "Touche num5");
  });

  globalShortcut.register("num6", () => {
    mainWindow.webContents.send("num6", "Touche num6");
  });

  const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    console.log("Connected to the SQLite database");
  });

  db.serialize(() => {
    // -- Table "Recettes"
    db.run(
      `CREATE TABLE IF NOT EXISTS Recettes (
        ID INTEGER PRIMARY KEY,
        Nom TEXT,
        Description TEXT,
        Temps INTEGER
      )`,
      (err) => {
        if (err) {
          console.error(err.message);
          process.exit(1);
        }
        console.log("Created the Recettes table");
      }
    );

    // -- Table "Ingredients"
    db.run(
      `CREATE TABLE IF NOT EXISTS Ingredients (
        ID INTEGER PRIMARY KEY,
        Nom TEXT
      )`,
      (err) => {
        if (err) {
          console.error(err.message);
          process.exit(1);
        }
        console.log("Created the Ingredients table");
      }
    );

    // -- Table "Recette_Ingredients"
    db.run(
      `CREATE TABLE IF NOT EXISTS Recette_Ingredients  (
        ID_Recette INTEGER,
        ID_Ingredient INTEGER,
        Quantite INTEGER,
        FOREIGN KEY (ID_Recette) REFERENCES Recettes

(ID),
        FOREIGN KEY (ID_Ingredient) REFERENCES Ingredients(ID)
      )`,
      (err) => {
        if (err) {
          console.error(err.message);
          process.exit(1);
        }
        console.log("Created the Recette_Ingredients table");
      }
    );

    // -- Table "Etapes"
    db.run(
      `CREATE TABLE IF NOT EXISTS Etapes (
        ID INTEGER PRIMARY KEY,
        ID_Recette INTEGER,
        Description TEXT,
        Temps INTEGER,
        FOREIGN KEY (ID_Recette) REFERENCES Recettes(ID)
      )`,
      (err) => {
        if (err) {
          console.error(err.message);
          process.exit(1);
        }
        console.log("Created the Etapes table");
      }
    );

    // Vérifie si la table existe déjà avant de la créer
    // db.run("INSERT INTO Recettes (Nom, Description, Temps) VALUES ('Gâteau au chocolat', 'Délicieux gâteau au chocolat fondant', 60)");

    // db.run("INSERT INTO Ingredients (Nom) VALUES ('Chocolat')");
  });

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

  ipcMain.handle("add-data-to-db", async (event, data) => {
    return new Promise((resolve, reject) => {
      const { name, description, temps } = data;
      db.run(
        "INSERT INTO Recettes (Nom, Description, Temps) VALUES (?, ?, ?)",
        [name, description, temps],
        function (err) {
          if (err) {
            reject(err.message);
          } else {
            console.log(name, description, temps);
            mainWindow.webContents.emit("data-added");
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

app.on("window-all-closed", () => {
  app.quit();
});
