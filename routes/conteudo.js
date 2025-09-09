import express from "express";
import { query } from "../db.js";

const router = express.Router();

// Listar tudo
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM gerenciamento");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Adicionar
router.post("/", async (req, res, next) => {
  try {
    const { avisosPastor, avisoCulto, nome, louvor, testemunho } = req.body;
    const { rows } = await query(
      `INSERT INTO gerenciamento (avisosPastor, avisoCulto, nome, louvor, testemunho) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [avisosPastor, avisoCulto, nome, louvor, testemunho]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Deletar por id (se você adicionar um id SERIAL depois)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM gerenciamento WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
