import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

// let responseBody = undefined;

describe("POST api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Receive a error response - not allowed method - POST", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint.",
        action: "Verifique o método HTTP enviado.",
        status_code: 405,
      });
    });
  });
});
