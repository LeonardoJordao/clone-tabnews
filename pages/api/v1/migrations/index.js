import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import createMigrator from "models/migrator.js";
import database from "infra/database.js";

const migrator = createMigrator(database);

const getHandler = async (req, res) => {
  const pendingMigrations = await migrator.listPendingMigrations();
  return res.status(200).json(pendingMigrations);
};

const postHandler = async (req, res) => {
  const executedMigrations = await migrator.runPendingMigrations();

  if (executedMigrations.length > 0)
    return res.status(201).json(executedMigrations);

  return res.status(200).json(executedMigrations);
};

const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);
