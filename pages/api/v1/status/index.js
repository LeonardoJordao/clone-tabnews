import database from "infra/database.js";

const status = async (req, res) => {
  const updatedAt = new Date().toISOString();
  const dbData = await database.query(
    `SELECT version, max_connections, used_connections
     FROM
      (SELECT version() AS version) t1,
      (SELECT sum(numbackends)::int AS used_connections FROM pg_stat_database WHERE datname is not null) t2,
      (SELECT setting::int AS max_connections FROM pg_settings WHERE name = 'max_connections') t3
    ;`,
  );
  const dbVersionValue = await database.query("SHOW server_version;");

  // const dbVersion = dbData.rows[0].version;
  const dbVersion = dbVersionValue.rows[0].server_version;
  const dbMaxConnections = dbData.rows[0].max_connections;
  const dbUsedConnections = dbData.rows[0].used_connections;

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion,
        max_connections: dbMaxConnections,
        used_connections: dbUsedConnections,
      },
    },
  });
};

export default status;

// const maxConnections = await database.query(
//   "SELECT setting as max_connections FROM pg_settings WHERE name = 'max_connections';",
// );
// console.log(maxConnections.rows);

// const usedConnections = await database.query(
//   // "SELECT count(*) FROM pg_stat_activity WHERE datname is not null;",
//   "SELECT sum(numbackends) as used_connections FROM pg_stat_database WHERE datname is not null;",
// );
// console.log(usedConnections.rows);

// const pgVersion = await database.query("SELECT version() pg_version;");
// console.log(pgVersion.rows[0].pg_version);

// const listConnections = await database.query(
//   `select max_conn,used,res_for_super,max_conn-used-res_for_super res_for_normal
//    from
//     (select count(*) used from pg_stat_activity) t1,
//     (select setting::int res_for_super from pg_settings where name=$$superuser_reserved_connections$$) t2,
//     (select setting::int max_conn from pg_settings where name=$$max_connections$$) t3
//   ;`,
// );
// console.log(listConnections.rows);
