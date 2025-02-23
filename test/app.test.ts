import request from "supertest";
import { app } from "../index";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER ? String(process.env.PGUSER) : "postgres",
  host: process.env.PGHOST ? String(process.env.PGHOST) : "localhost",
  database: process.env.PGDATABASE 
    ? String(process.env.PGDATABASE) 
    : "book_index",
  password: process.env.PGPASSWORD 
    ? String(process.env.PGPASSWORD) 
    : "password",
  port: parseInt(process.env.PGPORT || "5432", 10),
});


beforeAll(async () => {
  await pool.query("DELETE FROM index_entries");
});


afterAll(async () => {
  await pool.end();
});

describe("Book Index REST API", () => {
  let createdEntry: any;

  it("should create a new entry", async () => {
    const res = await request(app)
      .post("/entries")
      .send({
        word: "testword",
        pages: [1, 2, 3]
      })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.word).toBe("testword");
    expect(res.body.pages).toEqual([1, 2, 3]);
    createdEntry = res.body;
  });

  it("should retrieve all entries", async () => {
    const res = await request(app).get("/entries").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should retrieve an entry by id", async () => {
    const res = await request(app)
      .get(`/entries/${createdEntry.id}`)
      .expect(200);
    expect(res.body.word).toBe("testword");
  });

  it("should update an entry", async () => {
    const res = await request(app)
      .put(`/entries/${createdEntry.id}`)
      .send({ word: "updatedword" })
      .expect(200);
    expect(res.body.word).toBe("updatedword");
  });

  it("should delete an entry", async () => {
    await request(app)
      .delete(`/entries/${createdEntry.id}`)
      .expect(200);
  });

  it("should return 404 when fetching a deleted entry", async () => {
    await request(app)
      .get(`/entries/${createdEntry.id}`)
      .expect(404);
  });
});
