const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "postgres",
  database: "mydatabase",
});

client.connect();

client.query("select * from users", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err);
  }
  client.end;
});
