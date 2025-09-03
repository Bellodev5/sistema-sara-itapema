import express from "express";
import { query } from "../db.js";

const router = express.Router();

// Listar todos os conteúdos
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM conteudo ORDER BY data_criacao DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { tipo, nome, descricao } = req.body;
    
    if ((tipo !== "avisoculto" && tipo !== "avisopastor") && !nome) {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    // Descrição sempre obrigatória
    if (!descricao) {
      return res.status(400).json({ message: "Descrição é obrigatória" });
    }

    const { rows } = await query(
      "INSERT INTO conteudo (tipo, nome, descricao) VALUES ($1, $2, $3) RETURNING id, tipo, nome, descricao",
      [tipo, nome || null, descricao]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
});

// Deletar conteúdo por ID
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query("DELETE FROM conteudo WHERE id = $1", [id]);
    if (rowCount === 0) return res.status(404).json({ message: "Conteúdo não encontrado" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;