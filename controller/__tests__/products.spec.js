const request = require("supertest");
const express = require("express");
const { newDb } = require("pg-mem");

const app = express();
const db = newDb();


app.get("/test", async (req, res) => {
  const products = await db.public.many(`SELECT * FROM products`);
  res.json(products);
});

beforeAll(async () => {
    await db.public.many(`create table products(id text, name text, price int);
    INSERT INTO products (id, name, price)
    VALUES ('1','prueba', 20000);`)

    const products = await db.public.many(`SELECT * FROM products`);
});

afterAll(async () => {
    // await tearDown(db);    
});

describe("API Tests", () => {
  it("validate route and exist product", async () => {
    const response = await request(app).get("/test");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1); 
  });
});



