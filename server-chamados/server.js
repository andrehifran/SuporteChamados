// server.js - API REST com Autenticação e Proteção de Rotas
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("./supabase");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_padrao";

app.use(cors());
app.use(express.json());

// ============================================================================
// MIDDLEWARE DE AUTENTICAÇÃO (O "Segurança" da Festa)
// ============================================================================
function autenticarToken(req, res, next) {
  // Captura o cabeçalho Authorization enviado pelo cliente
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res
      .status(401)
      .json({ erro: "Acesso negado. Token não fornecido!" });
  }

  // Verifica se o token é válido e não expirou
  jwt.verify(token, JWT_SECRET, (err, usuarioDecodificado) => {
    if (err) {
      return res.status(403).json({ erro: "Token inválido ou expirado!" });
    }

    // Salva os dados do usuário na requisição para uso posterior
    req.usuario = usuarioDecodificado;
    next(); // Libera a requisição para continuar para a rota
  });
}

// ============================================================================
// ROTAS DE AUTENTICAÇÃO (PÚBLICAS)
// ============================================================================

// 1. CADASTRAR NOVO USUÁRIO (POST /api/auth/cadastrar)
app.post("/api/auth/cadastrar", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ erro: "Nome, e-mail e senha são obrigatórios." });
  }

  try {
    // Criptografa a senha antes de salvar no Supabase (Hash)
    const senhaHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nome, email, senha: senhaHash }])
      .select();

    if (error) {
      return res
        .status(400)
        .json({ erro: "E-mail já cadastrado ou erro no banco." });
    }

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: { id: data[0].id, nome: data[0].nome, email: data[0].email },
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno ao cadastrar usuário." });
  }
});

// 2. LOGIN DE USUÁRIO (POST /api/auth/login)
app.post("/api/auth/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  // Busca o usuário no Supabase pelo e-mail
  const { data: usuario, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !usuario) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  // Compara a senha digitada com o Hash salvo no banco
  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  // Gera o Token JWT assinado (válido por 8 horas)
  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    JWT_SECRET,
    { expiresIn: "8h" },
  );

  res.status(200).json({
    mensagem: "Login realizado com sucesso!",
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
  });
});

// ============================================================================
// ROTAS DE CHAMADOS (ALGUMAS PROTEGIDAS POR TOKEN)
// ============================================================================

// Listar chamados (Pública)
app.get("/api/chamados", async (req, res) => {
  const { data, error } = await supabase
    .from("chamados")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).json({ erro: error.message });
  res.status(200).json(data);
});

// Criar chamado (PROTEGIDA: exige que o usuário esteja logado!)
app.post("/api/chamados", autenticarToken, async (req, res) => {
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
    usuario_id: req.usuario.id, // Pega o ID diretamente do token validado!
  };

  const { data, error } = await supabase
    .from("chamados")
    .insert([novoChamado])
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(data[0]);
});

// Excluir chamado (PROTEGIDA)
app.delete("/api/chamados/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("chamados").delete().eq("id", id);

  if (error) return res.status(500).json({ erro: error.message });
  res.status(200).json({ mensagem: "Chamado excluído com sucesso!" });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Servidor com Autenticação JWT rodando em: http://localhost:${PORT}`,
  );
});

//CRIAR UMA ROTA PARA O MARIADB
const mysql = require("mysql2/promise");

// Rota de teste exclusiva do MariaDB local
app.get("/api/mariadb/chamados", async (req, res) => {
  try {
    // Conecta ao MariaDB local no DBeaver
    const conexao = await mysql.createConnection({
      host: "localhost",
      user: "root", // Seu usuário do MariaDB
      password: "idep@123", // Sua senha do MariaDB
      database: "bd_chamados",
    });

    const [linhas] = await conexao.query("SELECT * FROM chamados");
    await conexao.end(); // Fecha a conexão

    res.status(200).json({
      origem: "Dados vindos do MariaDB Local!",
      dados: linhas,
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});
