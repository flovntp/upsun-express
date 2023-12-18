const express = require('express')
const app = express()
const mysql = require("mysql2/promise");
const port = (process.env.PORT || '3000');
function openConnection() {

  let database_password = 'express'
  if (process.env.DATABASE_PASSWORD !== undefined) {
    database_password = process.env.DATABASE_PASSWORD
  }

  return mysql.createConnection({
    host: (process.env.DATABASE_HOST || '127.0.0.1'),
    port: (process.env.DATABASE_PORT || '3306'),
    user: (process.env.DATABASE_USERNAME || 'user'),
    password: database_password,
    database: (process.env.DATABASE_PATH || 'express')
  });
}
function createTable(connection) {
  return connection.execute(
    `CREATE TABLE IF NOT EXISTS upsuninfo (
      uid INT(10) NOT NULL AUTO_INCREMENT,
      username VARCHAR(64) NULL DEFAULT NULL,
      departname VARCHAR(128) NULL DEFAULT NULL,
      created DATE NULL DEFAULT NULL,
      PRIMARY KEY (uid)
    ) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;`
  );
}
function insertData(connection) {
  return connection.execute(
    "INSERT INTO upsuninfo (username, departname, created) VALUES ('upsun', 'Deploy Friday', '2023-12-18')"
  );
}
function readData(connection) {
  return connection.query("SELECT * FROM upsuninfo");
}
function dropTable(connection) {
  return connection.execute("DROP TABLE upsuninfo");
}
// Define the main route.
app.get('/', async function(req, res){
  // Connect to MariaDB.
  const connection = await openConnection();
  await createTable(connection);
  await insertData(connection);
  const [rows] = await readData(connection);
  const droppedResult = await dropTable(connection);
  // Make the output.
  const outputString = `Hello, World! - A simple Express web framework template for Upsun
MariaDB Tests:
* Connect and add row:
  - Row ID (1): ${rows[0].uid}
  - Username (upsun): ${rows[0].username}
  - Department (Deploy Friday): ${rows[0].departname}
  - Created (2023-09-29): ${rows[0].created}
* Delete row:
  - Status (0): ${droppedResult[0].warningStatus}`;
  res.set('Content-Type', 'text/plain');
  res.send(outputString);
});
// Get PORT and start the server
app.listen(port, function() {
  console.log(`Listening on port ${port}`)
});