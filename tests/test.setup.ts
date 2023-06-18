import knexConfig from "../src/database/knexfile";

async function setupTestDatabase(): Promise<void> {
  await knexConfig.migrate.latest();
}

async function teardownTestDatabase(): Promise<void> {
  await knexConfig.migrate.rollback(undefined, true);
  await knexConfig.destroy();
}

export { setupTestDatabase, teardownTestDatabase };
