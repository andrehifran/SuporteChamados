// src/components/ChamadoCard.jsx
export default function ChamadoCard({
  id,
  titulo,
  descricao,
  prioridade,
  statusInicial,
  data,
  onAlternarStatus,
  onRemover,
}) {
  const classeStatus = statusInicial
    ? statusInicial.toLowerCase().replace(" ", "-")
    : "aberto";

  return (
    <article className="chamado-card">
      <div className="chamado-header">
        <span className="chamado-id">#{id}</span>
        <span className={`status-badge status-${classeStatus}`}>
          {statusInicial}
        </span>
      </div>

      <h3 className="chamado-titulo">{titulo}</h3>
      <p className="chamado-descricao">{descricao}</p>

      <div className="chamado-footer">
        <span className="prioridade">
          Prioridade: <strong>{prioridade}</strong>
        </span>
        <span className="data">{data}</span>
      </div>

      <div className="chamado-acoes">
        <button className="btn-status" onClick={onAlternarStatus}>
          🔄 Alterar Status
        </button>

        <button className="btn-remover" onClick={onRemover}>
          🗑️ Remover
        </button>
      </div>
    </article>
  );
}
