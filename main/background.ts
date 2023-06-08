import { app, globalShortcut, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import * as sqlite3 from "sqlite3";
import * as path from "path";

const dbFilePath = path.join(__dirname, "database");

const isProd = process.env.NODE_ENV === "production";

let mainWindow = null;
let settingsWindow = null;

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

  settingsWindow = createWindow("settings", {
    title: "Settings",
    maximizable: true,
    width: 1200,
    height: 800,
    minHeight: 500,
    minWidth: 700,
    show: false,
    autoHideMenuBar: true,
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
    settingsWindow.show();
  });

  settingsWindow.on("close", (event) => {
    event.preventDefault();
    settingsWindow.hide();
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
    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      ["categories"],
      async (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        if (row) {
          console.log(`La table categories existe.`);
        } else {
          try {
            await new Promise<void>((resolve, reject) => {
              db.run(
                `CREATE TABLE IF NOT EXISTS categories (
                  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                  title VARCHAR(150) NOT NULL,
                  description TEXT
                );`,
                (err) => {
                  if (err) {
                    console.error(err.message);
                    reject(err);
                  } else {
                    console.log("CREATE categories TABLE");
                    resolve();
                  }
                }
              );
            });

            await new Promise<void>((resolve, reject) => {
              // 1 -> TvT, 2 -> TvZ, 3 -> TvP, 4 -> ZvT, 5 -> ZvZ, 6 -> ZvP, 7 -> PvT, 8 -> PvZ, 9 -> PvP
              db.run(
                `INSERT INTO categories (title)
                VALUES ('tvt'), ('tvz'), ('tvp'),('zvt'), ('zvz'), ('zvp'), ('pvt'), ('pvz'), ('pvp');`,
                (err) => {
                  if (err) {
                    console.error(err.message);
                    process.exit(1);
                  }
                  console.log("INSERT categories DATA");
                }
              );
            });
          } catch (error) {
            console.error("An error occurred:", error);
          }
        }
      }
    );

    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      ["build_order"],
      async (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        if (row) {
          console.log(`La table build_order existe.`);
        } else {
          try {
            await new Promise<void>((resolve, reject) => {
              db.run(
                `CREATE TABLE IF NOT EXISTS build_order (
                  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                  title VARCHAR(150) NOT NULL,
                  content TEXT,
                  category_id INTEGER,
                  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
                );`,
                (err) => {
                  if (err) {
                    console.error(err.message);
                    reject(err);
                  } else {
                    console.log("CREATE build_order TABLE");
                    resolve();
                  }
                }
              );
            });

            await new Promise<void>((resolve, reject) => {
              db.run(
                `INSERT INTO build_order (title, category_id)
                VALUES
                    ('Crême anglaise', 2),
                    ('Soupe', 1),
                    ('Salade de fruit', 2);`,
                (err) => {
                  if (err) {
                    console.error(err.message);
                    process.exit(1);
                  }
                  console.log("INSERT build_order DATA");
                }
              );
            });
          } catch (error) {
            console.error("An error occurred:", error);
          }
        }
      }
    );

    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      ["etapes"],
      async (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        if (row) {
          console.log(`La table etapes existe.`);
        } else {
          try {
            await new Promise<void>((resolve, reject) => {
              db.run(
                `CREATE TABLE IF NOT EXISTS etapes (
                  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                  content TEXT,
                  population INTEGER,
                  timer INTEGER,
                  build_order_id INTEGER,
                  FOREIGN KEY (build_order_id) REFERENCES build_order(id) ON DELETE SET NULL
                );`,
                (err) => {
                  if (err) {
                    console.error(err.message);
                    reject(err);
                  } else {
                    console.log("CREATE etapes TABLE");
                    resolve();
                  }
                }
              );
            });

            await new Promise<void>((resolve, reject) => {
              db.run(
                `INSERT INTO etapes (build_order_id, content, population, timer)
                VALUES
                    ('1', "faire un VCS", 12, 0),
                    ('1', "Faire un dépot", 14, 5),
                    ('1', "Faire une caserne", 20, 10),
                    ('2', "faire un VCS",50,50),
                    ('2', "Faire un dépot",60,60),
                    ('2', "Faire une caserne",78,78),
                    ('3', "faire un VCS",4,4),
                    ('3', "Faire un dépot",5,5),
                    ('3', "Faire une caserne",6,6);`,
                (err) => {
                  if (err) {
                    console.error(err.message);
                    process.exit(1);
                  }
                  console.log("INSERT etapes DATA");
                }
              );
            });
          } catch (error) {
            console.error("An error occurred:", error);
          }
        }
      }
    );
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

  ipcMain.on("close-settings-page", (e) => {
    console.log("Closing settings page");
    e.preventDefault();
    settingsWindow.hide();
  });

  ipcMain.on("resize-settings-page", () => {
    settingsWindow.maximize();
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

app.on("window-all-closed", () => {
  app.quit();
});
