import express from "express";
import { query } from "../db.js";
import { Parser } from "json2csv";

const router = express.Router();

// Listar todos os visitantes
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM visitantes ORDER BY data_visita DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});


// Criar visitante
router.post("/", async (req, res, next) => {
  try {
    const { nome, contato, interesse, mais_info } = req.body;

    if (!nome) return res.status(400).json({ message: "Nome é obrigatório" });

    const { rows } = await query(
      "INSERT INTO visitantes (nome, contato, interesse, mais_info) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, contato || null, interesse || null, mais_info || null]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Deletar visitante
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query("DELETE FROM visitantes WHERE id = $1", [id]);
    if (rowCount === 0) return res.status(404).json({ message: "Visitante não encontrado" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Exportar visitantes como CSV
router.get("/export/csv", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM visitantes ORDER BY data_visita DESC");
    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("visitantes.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

export default router;
