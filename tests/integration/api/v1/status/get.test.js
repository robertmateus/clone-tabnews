import orquestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      // valida que é uma data ISO válida
      expect(Number.isNaN(Date.parse(responseBody.update_at))).toBe(false);

      expect(responseBody.database.version).toBe("16.0");
      expect(responseBody.database.max_connections).toBe(100);
      expect(responseBody.database.opened_connections).toBeGreaterThanOrEqual(
        1,
      );
    });
  });
});
