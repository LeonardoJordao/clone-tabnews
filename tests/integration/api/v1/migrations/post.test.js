import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

let responseBody = undefined;

test("POST to api/v1/migrations should return 200", async () => {
  // PRIMEIRO POST - RODA A MIGRATION
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  //espera uma lista de migrations
  responseBody = await response1.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  // SEGUNDO POST - NÃO DEVE HAVER MIGRATION PARA EXECUTAR
  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  //espera uma lista de migrations VAZIA
  responseBody = await response2.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBe(0);
});