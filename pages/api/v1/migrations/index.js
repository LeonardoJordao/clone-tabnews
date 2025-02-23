import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

const getHandler = async (req, res) => {
  const dbClient = await database.getNewClient();
  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return res.status(200).json(pendingMigrations);
  } finally {
    await dbClient?.end();
  }
};

const postHandler = async (req, res) => {
  const dbClient = await database.getNewClient();
  try {
    const executedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (executedMigrations.length > 0)
      return res.status(201).json(executedMigrations);

    return res.status(200).json(executedMigrations);
  } finally {
    await dbClient?.end();
  }
};

const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);
