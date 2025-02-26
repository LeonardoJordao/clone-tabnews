import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

const listPendingMigrations = async () => {
  const dbClient = await database.getNewClient();
  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
};

const runPendingMigrations = async () => {
  const dbClient = await database.getNewClient();
  try {
    const executedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });
    return executedMigrations;
  } finally {
    await dbClient?.end();
  }
};

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
