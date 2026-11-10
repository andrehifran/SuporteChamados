// server.js - API REST Completa (CRUD) do Sistema de Chamados

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json()); // OBRIGATÓRIO: permite ler dados JSON no req.body

// Banco de dados em memória (simulado)
let chamados = [
  {
    id: 101,
    titulo: "Impressora do setor financeiro não responde",
    descricao: "Erro de comunicação de rede no 2º andar.",
    prioridade: "Alta",
    status: "Aberto",
    data: "2026-11-14",
  },
  {
    id: 102,
    titulo: "Computador travando ao iniciar o sistema",
    descricao: "Lentidão recorrente no setor de RH.",
    prioridade: "Média",
    status: "Em Andamento",
    data: "2026-11-14",
  },
];

// ============================================================================
// ROTAS DA API REST (CRUD)
// ============================================================================

// 1. HEALTH CHECK (GET)
app.get("/", (req, res) => {
  res.send("API do Sistema de Chamados de Suporte Técnico rodando!");
});

// 2. READ ALL (GET) - Listar chamados
app.get("/api/chamados", (req, res) => {
  res.status(200).json(chamados);
});

// 3. READ ONE (GET) - Consultar chamado por ID
app.get("/api/chamados/:id", (req, res) => {
  const idBusca = parseInt(req.params.id);
  const chamado = chamados.find((c) => c.id === idBusca);

  if (!chamado) {
    return res.status(404).json({ erro: "Chamado não encontrado." });
  }

  res.status(200).json(chamado);
});

// 4. CREATE (POST) - Cadastrar novo chamado
app.post("/api/chamados", (req, res) => {
  const { titulo, descricao, prioridade } = req.body;

  // Validação simples de campos obrigatórios
  if (!titulo || !descricao) {
    return res.status(400).json({
      erro: "Título e descrição são campos obrigatórios.",
    });
  }

  // Cria o novo chamado
  const novoChamado = {
    id: Date.now(), // Gera ID único temporário
    titulo,
    descricao,
    prioridade: prioridade || "Baixa",
    status: "Aberto",
    data: new Date().toISOString().split("T")[0],
  };

  chamados.push(novoChamado);

  // Retorna status 201 Created com o objeto criado
  res.status(201).json(novoChamado);
});

// 5. UPDATE (PUT) - Atualizar um chamado existente
app.put("/api/chamados/:id", (req, res) => {
  const idBusca = parseInt(req.params.id);
  const index = chamados.findIndex((c) => c.id === idBusca);

  if (index === -1) {
    return res
      .status(404)
      .json({ erro: "Chamado não encontrado para atualização." });
  }

  // Atualiza os dados mantendo o ID original
  const { titulo, descricao, prioridade, status } = req.body;

  chamados[index] = {
    ...chamados[index],
    titulo: titulo || chamados[index].titulo,
    descricao: descricao || chamados[index].descricao,
    prioridade: prioridade || chamados[index].prioridade,
    status: status || chamados[index].status,
  };

  res.status(200).json({
    mensagem: "Chamado atualizado com sucesso!",
    chamado: chamados[index],
  });
});

// 6. DELETE (DELETE) - Excluir um chamado por ID
app.delete("/api/chamados/:id", (req, res) => {
  const idBusca = parseInt(req.params.id);
  const index = chamados.findIndex((c) => c.id === idBusca);

  if (index === -1) {
    return res
      .status(404)
      .json({ erro: "Chamado não encontrado para exclusão." });
  }

  // Remove o chamado do array
  const chamadoRemovido = chamados.splice(index, 1);

  res.status(200).json({
    mensagem: "Chamado excluído com sucesso!",
    chamado: chamadoRemovido[0],
  });
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});
