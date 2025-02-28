import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { ServiceError } from "infra/errors.js";
import databaseClient from "infra/database.js";

const createMigrator = (database) => {
  if (!database) {
    database = databaseClient;
  }
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
    } catch (error) {
      throw new ServiceError({
        message: "Falha ao listar migrações pendentes.",
        cause: error,
      });
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
    } catch (error) {
      throw new ServiceError({
        message: "Falha ao rodar migrações pendentes.",
        cause: error,
      });
    } finally {
      await dbClient?.end();
    }
  };

  const migrator = {
    listPendingMigrations,
    runPendingMigrations,
  };
  return migrator;
};

export default createMigrator;
