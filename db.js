import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve("./data/data.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar no SQLite:", err.message);
  } else {
    console.log("Conectado ao banco SQLite em", dbPath);
  }
});

// Criação da tabela (corrigida)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pessoas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      area TEXT NOT NULL,
      descricao TEXT,
      telefone TEXT,
      maisInfo TEXT
    )
  `);
});

export default db;
