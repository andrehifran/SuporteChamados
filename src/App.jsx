// src/App.jsx - React Integrado à API Express/Supabase
import { useState, useEffect } from "react";
import Header from "./components/Header";
import ResumoMetricas from "./components/ResumoMetricas";
import FormularioChamado from "./components/FormularioChamado";
import FiltroChamados from "./components/FiltroChamados";
import ChamadoCard from "./components/ChamadoCard";
import "./App.css";

const API_URL = "http://localhost:3001/api/chamados";

export default function App() {
  const [chamados, setChamados] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  // 1. CARREGAR CHAMADOS DA API (GET)
  async function carregarChamados() {
    try {
      setCarregando(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar chamados");
      const dados = await res.json();
      setChamados(dados);
    } catch (erro) {
      console.error(erro);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarChamados();
  }, []);

  // 2. CADASTRAR CHAMADO NA API (POST)
  async function adicionarChamado(novoChamado) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoChamado),
      });

      if (!res.ok) throw new Error("Erro ao salvar chamado");

      // Recarrega a lista do banco de dados atualizada
      carregarChamados();
    } catch (erro) {
      alert("Falha ao cadastrar chamado no banco de dados.");
    }
  }

  // 3. ALTERAR STATUS NA API (PUT)
  async function alternarStatus(id, statusAtual) {
    const proximoStatus =
      statusAtual === "Aberto"
        ? "Em Andamento"
        : statusAtual === "Em Andamento"
          ? "Concluído"
          : "Aberto";

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: proximoStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");

      carregarChamados();
    } catch (erro) {
      alert("Falha ao atualizar status no banco de dados.");
    }
  }

  // 4. EXCLUIR CHAMADO NA API (DELETE)
  async function removerChamado(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao excluir chamado");

      carregarChamados();
    } catch (erro) {
      alert("Falha ao excluir chamado do banco de dados.");
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

        <FormularioChamado onAdicionarChamado={adicionarChamado} />

        <div className="top-bar">
          <h2>Painel de Chamados ({chamadosFiltrados.length})</h2>
          <FiltroChamados busca={busca} setBusca={setBusca} />
        </div>

        {carregando ? (
          <p className="sem-chamados">Carregando chamados do Supabase...</p>
        ) : (
          <section className="lista-chamados">
            {chamadosFiltrados.length === 0 ? (
              <p className="sem-chamados">
                Nenhum chamado encontrado no banco de dados.
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
                  onAlternarStatus={() =>
                    alternarStatus(chamado.id, chamado.status)
                  }
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
