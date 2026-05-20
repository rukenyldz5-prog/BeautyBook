const request = require("supertest");
const { app } = require("../server");

describe("Swagger docs", () => {
  test("GET /api-docs should return swagger UI page", async () => {
    const res = await request(app).get("/api-docs");
    expect(res.statusCode).toBe(301);
    expect(res.headers.location).toBe("/api-docs/");
  });

  test("GET /api-docs/ should return HTML", async () => {
    const res = await request(app).get("/api-docs/");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/html/);
  });

  test("GET /api-docs.json should return openapi spec", async () => {
    const res = await request(app).get("/api-docs.json");
    expect(res.statusCode).toBe(200);
    expect(res.body.openapi).toBe("3.0.0");
    expect(res.body.info.title).toBe("BeautyBook API");
  });
});
