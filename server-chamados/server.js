// server.js - API REST Integrada ao Supabase
const express = require("express");
const cors = require("cors");
const supabase = require("./supabase"); // Conexão com Supabase
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. HEALTH CHECK
app.get("/", (req, res) => {
  res.send("API integrada ao Supabase rodando com sucesso!");
});

// 2. READ ALL (GET) - Buscar todos os chamados do Supabase
app.get("/api/chamados", async (req, res) => {
  const { data, error } = await supabase
    .from("chamados")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  res.status(200).json(data);
});

// 3. READ ONE (GET) - Buscar chamado por ID
app.get("/api/chamados/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("chamados")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ erro: "Chamado não encontrado." });
  }

  res.status(200).json(data);
});

// 4. CREATE (POST) - Inserir novo chamado no Supabase
app.post("/api/chamados", async (req, res) => {
  const { titulo, descricao, prioridade } = req.body;

  if (!titulo || !descricao) {
    return res
      .status(400)
      .json({ erro: "Título e descrição são obrigatórios." });
  }

  const novoChamado = {
    titulo,
    descricao,
    prioridade: prioridade || "Baixa",
    status: "Aberto",
    data: new Date().toISOString().split("T")[0],
  };

  const { data, error } = await supabase
    .from("chamados")
    .insert([novoChamado])
    .select();

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  res.status(201).json(data[0]);
});

// 5. UPDATE (PUT) - Atualizar chamado no Supabase
app.put("/api/chamados/:id", async (req, res) => {
  const { id } = req.params;
  const { status, prioridade, titulo, descricao } = req.body;

  const dadosAtualizados = {};
  if (status) dadosAtualizados.status = status;
  if (prioridade) dadosAtualizados.prioridade = prioridade;
  if (titulo) dadosAtualizados.titulo = titulo;
  if (descricao) dadosAtualizados.descricao = descricao;

  const { data, error } = await supabase
    .from("chamados")
    .update(dadosAtualizados)
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  res.status(200).json({
    mensagem: "Chamado atualizado no banco de dados!",
    chamado: data[0],
  });
});

// 6. DELETE (DELETE) - Excluir chamado no Supabase
app.delete("/api/chamados/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("chamados").delete().eq("id", id);

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  res
    .status(200)
    .json({ mensagem: "Chamado excluído do banco de dados com sucesso!" });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(
    `🚀 Servidor rodando integrado ao Supabase em: http://localhost:${PORT}`,
  );
});
