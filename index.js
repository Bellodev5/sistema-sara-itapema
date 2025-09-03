import express from "express";
import path from "path";
import cors from "cors";

// Rotas
import conteudoRoutes from "./routes/conteudo.js";
import visitantesRoutes from "./routes/visitantes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve("./public")));

// Rotas do sistema
app.use("/conteudo", conteudoRoutes);
app.use("/visitantes", visitantesRoutes);

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});

// Verificar se está tudo ok
app.get("/health", (req, res) => res.send("Ok"));

// Handler(gerenciamento) de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erro interno" });
});

// Rodar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
