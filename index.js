import express from "express";
import path from "path"
import pessoasRouter from "./routes/pessoas.js";

const app = express();
app.use(express.json());

app.use(express.static(path.resolve("./public")));

app.use("/pessoas", pessoasRouter);

const PORT = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
