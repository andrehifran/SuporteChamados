// src/App.jsx
import { useState, useEffect } from "react";
import Header from "./components/Header";
import ResumoMetricas from "./components/ResumoMetricas";
import FormularioChamado from "./components/FormularioChamado";
import FiltroChamados from "./components/FiltroChamados";
import ChamadoCard from "./components/ChamadoCard";
import "./App.css";

export default function App() {
  // Inicializa o estado lendo os dados salvos no localStorage (se existirem)
  const [chamados, setChamados] = useState(() => {
    const salvos = localStorage.getItem("chamados_db");
    if (salvos) {
      return JSON.parse(salvos);
    }
    return [
      {
        id: 101,
        titulo: "Impressora do setor financeiro não responde",
        descricao: "Erro de comunicação de rede no 2º andar.",
        prioridade: "Alta",
        statusInicial: "Aberto",
        data: "14/11/2026",
      },
    ];
  });

  const [busca, setBusca] = useState("");

  // useEffect: Salva automaticamente no localStorage sempre que a lista de chamados mudar!
  useEffect(() => {
    localStorage.setItem("chamados_db", JSON.stringify(chamados));
  }, [chamados]); // Executa sempre que a variável 'chamados' for alterada

  function adicionarChamado(novoChamado) {
    setChamados([novoChamado, ...chamados]);
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

        <section className="lista-chamados">
          {chamadosFiltrados.length === 0 ? (
            <p className="sem-chamados">
              Nenhum chamado cadastrado ou encontrado.
            </p>
          ) : (
            chamadosFiltrados.map((chamado) => (
              <ChamadoCard
                key={chamado.id}
                id={chamado.id}
                titulo={chamado.titulo}
                descricao={chamado.descricao}
                prioridade={chamado.prioridade}
                statusInicial={chamado.statusInicial}
                data={chamado.data}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
