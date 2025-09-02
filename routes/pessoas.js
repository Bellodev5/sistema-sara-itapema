import express from "express";
import db from "../db.js";

const router = express.Router();

// Listar todas as pessoas
router.get("/", (req, res) => {
  db.all("SELECT * FROM pessoas", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Adicionar nova pessoa
router.post("/", (req, res) => {
  const { nome, area, descricao } = req.body;

  if (!nome || !area) {
    return res.status(400).json({ error: "Nome e área são obrigatórios" });
  }

  const desc = descricao || "";

  db.run(
    "INSERT INTO pessoas (nome, area, descricao) VALUES (?, ?, ?)",
    [nome, area, desc],
    function (err) {
      if (err) {
        console.error("Erro no INSERT:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, nome, area, descricao: desc });
    }
  );
});

// Deletar pessoa por ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM pessoas WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: this.changes > 0 });
  });
});

export default router;
