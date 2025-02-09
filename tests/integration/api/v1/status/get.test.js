import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

let responseBody = undefined;

describe("GET api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);
    });

    test("Receive a response body", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      responseBody = await response.json();
      expect(responseBody).toBeDefined();
    });

    test("Receive date of update", async () => {
      const updated_at = responseBody.updated_at;
      const parsedDate = new Date(updated_at).toISOString();
      expect(updated_at).toEqual(parsedDate);
      // console.log(updated_at);
    });

    test("Receive database version", async () => {
      const dbVersion = responseBody.dependencies.database.version;
      expect(dbVersion).toBeDefined();
      // console.log(dbVersion);
    });

    test("Receive database max_connections", async () => {
      const max_connections =
        responseBody.dependencies.database.max_connections;
      expect(typeof max_connections).toBe("number");
      // console.log(max_connections);
    });

    test("Receive database used_connections", async () => {
      const used_connections =
        responseBody.dependencies.database.used_connections;
      expect(used_connections).toEqual(1);
      // expect(typeof used_connections).toBe("number");
      // console.log(used_connections);
    });
  });
});
