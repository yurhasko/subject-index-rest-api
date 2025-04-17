import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));


const pool = new Pool({
  user: process.env.PGUSER ? String(process.env.PGUSER) : "postgres",
  host: process.env.PGHOST ? String(process.env.PGHOST) : "localhost",
  database: process.env.PGDATABASE 
    ? String(process.env.PGDATABASE) 
    : "book_index",
  password: process.env.PGPASSWORD 
    ? String(process.env.PGPASSWORD) 
    : "password",
  port: parseInt(process.env.PGPORT || "5432", 10)
});


app.get("/entries", async (req: Request, res: Response) => {
  try {
    const { search, sort } = req.query;
    let queryText = "SELECT id, word, pages FROM index_entries";
    const queryParams: any[] = [];

    if (search && typeof search === "string") {
      queryText += " WHERE word ILIKE $1";
      queryParams.push(`%${search}%`);
    }

    if (sort === "alphabetical") {
      queryText += " ORDER BY word ASC";
    }

    const result = await pool.query(queryText, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/entries/:id", async (req: Request<{ id: string }>, 
  res: Response) => {
  try {
    const { id } = req.params;
    const queryText = "SELECT id, word, pages FROM index_entries WHERE id = $1";
    const result = await pool.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/entries", async (req: Request, res: Response) => {
  try {
    const { word, pages } = req.body;

    if (!word || !pages || !Array.isArray(pages)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const queryText =
      "INSERT INTO index_entries (word, pages) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(queryText, [word, pages]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put("/entries/:id", async (req: Request<{ id: string }>, 
  res: Response) => {
  try {
    const { id } = req.params;
    const { word, pages } = req.body;
    if (!word && !pages) {
      return res
        .status(400)
        .json({ error: "No fields provided for update" });
    }

    const fields: string[] = [];
    const values: any[] = [];
    let counter = 1;

    if (word) {
      fields.push(`word = $${counter}`);
      values.push(word);
      counter++;
    }

    if (pages) {
      if (!Array.isArray(pages)) {
        return res.status(400).json({ error: "Pages must be an array" });
      }
      fields.push(`pages = $${counter}`);
      values.push(pages);
      counter++;
    }

    values.push(id);
    const queryText = `UPDATE index_entries SET ${fields.join(", ")}
          WHERE id = $${counter} RETURNING *`;
    const result = await pool.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/entries/:id", async (req: Request<{ id: string }>,
  res: Response) => {
  try {
    const { id } = req.params;
    const queryText =
      "DELETE FROM index_entries WHERE id = $1 RETURNING *";
    const result = await pool.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
