// src/App.jsx - Com Tela de Login e Proteção
import { useState, useEffect } from "react";
import Header from "./components/Header";
import ResumoMetricas from "./components/ResumoMetricas";
import FormularioChamado from "./components/FormularioChamado";
import FiltroChamados from "./components/FiltroChamados";
import ChamadoCard from "./components/ChamadoCard";
import Login from "./components/Login"; // Importamos o Login
import "./App.css";

export default function App() {
  // Estado de Autenticação
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario_chamados");
    return salvo ? JSON.parse(salvo) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token_chamados") || "",
  );
  const [chamados, setChamados] = useState([]);
  const [busca, setBusca] = useState("");
  const [bancoDestino, setBancoDestino] = useState("supabase");

  const API_URL =
    bancoDestino === "supabase"
      ? "http://localhost:3001/api/chamados"
      : "http://localhost:3001/api/mariadb/chamados";

  async function carregarChamados() {
    try {
      const res = await fetch(API_URL);
      const respostaJson = await res.json();
      const listaDados = respostaJson.dados ? respostaJson.dados : respostaJson;
      setChamados(Array.isArray(listaDados) ? listaDados : []);
    } catch (erro) {
      setChamados([]);
    }
  }

  useEffect(() => {
    if (usuario) {
      carregarChamados();
    }
  }, [bancoDestino, usuario]);

  function handleLoginSucesso(usuarioLogado, tokenGerado) {
    setUsuario(usuarioLogado);
    setToken(tokenGerado);
  }

  function handleLogout() {
    localStorage.removeItem("usuario_chamados");
    localStorage.removeItem("token_chamados");
    setUsuario(null);
    setToken("");
  }

  async function adicionarChamado(novoChamado) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoChamado),
      });

      if (!res.ok) throw new Error("Erro ao salvar");
      carregarChamados();
    } catch (erro) {
      alert("Falha ao cadastrar chamado.");
    }
  }

  async function removerChamado(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir");
      carregarChamados();
    } catch (erro) {
      alert("Falha ao excluir chamado.");
    }
  }

  // SE NÃO ESTIVER LOGADO -> MOSTRA APENAS A TELA DE LOGIN!
  if (!usuario) {
    return <Login onLoginSucesso={handleLoginSucesso} />;
  }

  // SE ESTIVER LOGADO -> MOSTRA O PAINEL COMPLETO
  const chamadosFiltrados = chamados.filter((c) =>
    c.titulo.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <span>
            👋 Olá, <strong>{usuario.nome}</strong> ({usuario.email})
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "#dc2626",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🚪 Sair (Logout)
          </button>
        </div>

        <ResumoMetricas />

        <div
          className="seletor-banco-container"
          style={{
            marginBottom: "15px",
            background: "#fff",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          <label style={{ fontWeight: "bold", marginRight: "10px" }}>
            🗄️ Selecione o Banco de Dados Ativo:
          </label>
          <select
            value={bancoDestino}
            onChange={(e) => setBancoDestino(e.target.value)}
          >
            <option value="supabase">Supabase (Nuvem / PostgreSQL)</option>
            <option value="mariadb">MariaDB (Local / DBeaver)</option>
          </select>
        </div>

        <FormularioChamado onAdicionarChamado={adicionarChamado} />

        <div className="top-bar">
          <h2>
            Chamados em [{bancoDestino.toUpperCase()}] (
            {chamadosFiltrados.length})
          </h2>
          <FiltroChamados busca={busca} setBusca={setBusca} />
        </div>

        <section className="lista-chamados">
          {chamadosFiltrados.map((chamado) => (
            <ChamadoCard
              key={chamado.id}
              id={chamado.id}
              titulo={chamado.titulo}
              descricao={chamado.descricao}
              prioridade={chamado.prioridade}
              statusInicial={chamado.status}
              data={chamado.data}
              onRemover={() => removerChamado(chamado.id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
