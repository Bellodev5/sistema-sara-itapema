import express from "express";
import { query } from "../db.js";

const router = express.Router();

// Listar
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM visitantes ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Adicionar
router.post("/", async (req, res, next) => {
  try {
    const { maisInfo, culto, telefone, endereco } = req.body;
    const { rows } = await query(
      `INSERT INTO visitantes (maisInfo, culto, telefone, endereco)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [maisInfo, culto, telefone, endereco]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Deletar
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM visitantes WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
