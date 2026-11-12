// src/App.jsx - Escolhendo o Banco de Dados dinamicamente
import { useState, useEffect } from "react";
import Header from "./components/Header";
import ResumoMetricas from "./components/ResumoMetricas";
import FormularioChamado from "./components/FormularioChamado";
import FiltroChamados from "./components/FiltroChamados";
import ChamadoCard from "./components/ChamadoCard";
import "./App.css";

export default function App() {
  const [chamados, setChamados] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  // 1. ESTADO PARA SELECIONAR QUAL BANCO USAR ('supabase' ou 'mariadb')
  const [bancoDestino, setBancoDestino] = useState("supabase");

  // Define a URL da API baseada no banco escolhido
  const API_URL =
    bancoDestino === "supabase"
      ? "http://localhost:3001/api/chamados"
      : "http://localhost:3001/api/mariadb/chamados";

  // 2. BUSCAR CHAMADOS DO BANCO SELECIONADO
  async function carregarChamados() {
    try {
      setCarregando(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar chamados");

      const respostaJson = await res.json();

      // O MariaDB retorna os dados dentro de um objeto { dados: [...] }
      const listaDados = respostaJson.dados ? respostaJson.dados : respostaJson;
      setChamados(listaDados);
    } catch (erro) {
      console.error(erro);
      setChamados([]);
    } finally {
      setCarregando(false);
    }
  }

  // Recarrega a lista sempre que o usuário mudar a opção do banco de dados no select
  useEffect(() => {
    carregarChamados();
  }, [bancoDestino]);

  // 3. CADASTRAR NO BANCO SELECIONADO
  async function adicionarChamado(novoChamado) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoChamado),
      });

      if (!res.ok) throw new Error("Erro ao salvar chamado");

      alert(`Chamado cadastrado com sucesso no ${bancoDestino.toUpperCase()}!`);
      carregarChamados(); // Atualiza a lista na tela
    } catch (erro) {
      alert(`Falha ao cadastrar chamado no ${bancoDestino.toUpperCase()}.`);
    }
  }

  // 4. EXCLUIR CHAMADO
  async function removerChamado(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao excluir chamado");

      carregarChamados();
    } catch (erro) {
      alert("Falha ao excluir chamado.");
    }
  }

  const chamadosFiltrados = chamados.filter((c) =>
    c.titulo.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <ResumoMetricas />

        {/* SELETOR DE BANCO DE DADOS NO FRONT-END */}
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
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
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

        {carregando ? (
          <p className="sem-chamados">
            Buscando dados no {bancoDestino.toUpperCase()}...
          </p>
        ) : (
          <section className="lista-chamados">
            {chamadosFiltrados.length === 0 ? (
              <p className="sem-chamados">
                Nenhum chamado encontrado neste banco de dados.
              </p>
            ) : (
              chamadosFiltrados.map((chamado) => (
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
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}
