const db = require("better-sqlite3")("db2.db");
// db.prepare(
//   `
//     CREATE TABLE usertable(
//         uid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
//         usertype TEXT,
//         username TEXT,
//         userpassword TEXT,
//         med TEXT
//     );
// `
// ).run();
db.prepare(
  `
    CREATE TABLE emergency(
        eid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        cord TEXT,
        respid TEXT,
        uid TEXT
    );
`
).run();
