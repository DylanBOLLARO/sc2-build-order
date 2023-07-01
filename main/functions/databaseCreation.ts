export function databaseCreation(db: any) {
  db.serialize(() => {
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
                        playrace INTEGER,
                        versusrace INTEGER
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
                `INSERT INTO build_order (title, playrace, versusrace)
                      VALUES
                          ('Crême anglaise', 0, 0),
                          ('Soupe', 1,1),
                          ('Salade de fruit', 2, 2);`,
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
}
