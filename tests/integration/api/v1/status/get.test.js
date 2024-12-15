import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

let responseBody = undefined;

test("GET to api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
});

test("GET to api/v1/status should have a response body ", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  responseBody = await response.json();
  expect(responseBody).toBeDefined();
});

test("updated_at should be a date", async () => {
  const updated_at = responseBody.updated_at;
  const parsedDate = new Date(updated_at).toISOString();
  expect(updated_at).toEqual(parsedDate);
  // console.log(updated_at);
});

test("Database version should be defined", async () => {
  const dbVersion = responseBody.dependencies.database.version;
  expect(dbVersion).toBeDefined();
  // console.log(dbVersion);
});

test("Database max_connections should be an integer", async () => {
  const max_connections = responseBody.dependencies.database.max_connections;
  expect(typeof max_connections).toBe("number");
  // console.log(max_connections);
});

test("Database used_connections should be 1", async () => {
  const used_connections = responseBody.dependencies.database.used_connections;
  expect(used_connections).toEqual(1);
  // expect(typeof used_connections).toBe("number");
  // console.log(used_connections);
});
