// src/components/ChamadoCard.jsx
import { useState } from "react";

export default function ChamadoCard({
  id,
  titulo,
  descricao,
  prioridade,
  statusInicial,
  data,
}) {
  // Estado 1: controla o status do chamado (Aberto, Em Andamento, Concluído)
  const [status, setStatus] = useState(statusInicial);

  // Estado 2 (Requisito 3 do Desafio): controla a visibilidade do cartão
  const [visivel, setVisivel] = useState(true);

  // RENDERIZAÇÃO CONDICIONAL: Se 'visivel' for false, o componente retorna null e NÃO aparece na tela!
  if (!visivel) {
    return null;
  }

  // Função para alternar o status
  function alternarStatus() {
    if (status === "Aberto") {
      setStatus("Em Andamento");
    } else if (status === "Em Andamento") {
      setStatus("Concluído");
    } else {
      setStatus("Aberto");
    }
  }

  // Função para ocultar o cartão
  function removerCartao() {
    setVisivel(false);
  }

  const classeStatus = status.toLowerCase().replace(" ", "-");

  return (
    <article className="chamado-card">
      <div className="chamado-header">
        <span className="chamado-id">#{id}</span>
        <span className={`status-badge status-${classeStatus}`}>{status}</span>
      </div>

      <h3 className="chamado-titulo">{titulo}</h3>
      <p className="chamado-descricao">{descricao}</p>

      <div className="chamado-footer">
        <span className="prioridade">
          Prioridade: <strong>{prioridade}</strong>
        </span>
        <span className="data">{data}</span>
      </div>

      {/* Área de Botões de Ação */}
      <div className="chamado-acoes">
        <button className="btn-status" onClick={alternarStatus}>
          🔄 Alterar Status
        </button>

        {/* Botão de remoção que altera o estado 'visivel' para false */}
        <button className="btn-remover" onClick={removerCartao}>
          🗑️ Remover
        </button>
      </div>
    </article>
  );
}
