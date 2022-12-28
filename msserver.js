var sql = require("mssql/msnodesqlv8");
var config = {
  connectionString:
    "Driver=SQL Server;Server=OR-PC\\SQLEXPRESS02;Database=Users;Trusted_Connection=true;",
};
sql.connect(config, (err) => {
  new sql.Request().query("SELECT * from Users", (err, result) => {
    console.log(".:The Good Place:.");
    if (err) {
      // SQL error, but connection OK.
      console.log("  Shirtballs: " + err);
    } else {
      // All is rosey in your garden.
      console.dir(result);
    }
  });
});
sql.on("error", (err) => {
  // Connection borked.
  console.log(".:The Bad Place:.");
  console.log("  Fork: " + err);
});