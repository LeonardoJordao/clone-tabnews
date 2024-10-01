let responseBody;

test("GET to api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  responseBody = await response.json();
  expect(response.status).toBe(200);
});

test("updated_at should be a date", async () => {
  const updated_at = responseBody.updated_at;
  expect(updated_at).toBeDefined();
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
  expect(max_connections).toBeDefined();
  expect(typeof max_connections).toBe("number");
  // console.log(max_connections);
});

test("Database used_connections should be an integer", async () => {
  const used_connections = responseBody.dependencies.database.used_connections;
  expect(used_connections).toBeDefined();
  expect(typeof used_connections).toBe("number");
  console.log(used_connections);
});
