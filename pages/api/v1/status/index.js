import database from "infra/database.js";

const status = async (req, res) => {
  const databaseName = process.env.POSTGRES_DB;
  const updatedAt = new Date().toISOString();
  const dbData = await database.query({
    text: `SELECT version, max_connections, used_connections
     FROM
      (SELECT version() AS version) t1,
      (SELECT count(*)::int AS used_connections FROM pg_stat_activity WHERE datname = $1) t2,
      (SELECT setting::int AS max_connections FROM pg_settings WHERE name = 'max_connections') t3
    ;`,
    values: [databaseName],
  });
  const dbVersionValue = await database.query("SHOW server_version;");

  const dbVersion = dbVersionValue.rows[0].server_version;
  // const dbVersion = dbData.rows[0].version;
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
