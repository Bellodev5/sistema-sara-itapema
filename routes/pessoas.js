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
  const { nome, area, descricao, telefone, maisInfo } = req.body;

  if (!nome || !area) {
    return res.status(400).json({ error: "Nome e área são obrigatórios" });
  }

  const desc = area === "visitante" ? null : descricao || "";
  const tel = area === "visitante" ? telefone || "-" : null;
  const mais = area === "visitante" ? maisInfo || "-" : null;

  db.run(
    "INSERT INTO pessoas (nome, area, descricao, telefone, maisInfo) VALUES (?, ?, ?, ?, ?)",
    [nome, area, desc, tel, mais],
    function (err) {
      if (err) {
        console.error("Erro no INSERT:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        nome,
        area,
        descricao: desc,
        telefone: tel,
        maisInfo: mais
      });
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