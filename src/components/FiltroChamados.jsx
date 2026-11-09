// src/components/FiltroChamados.jsx
export default function FiltroChamados({ busca, setBusca }) {
  return (
    <div className="filtro-container">
      <input
        type="text"
        placeholder="🔍 Pesquisar chamado por título..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="input-busca"
      />
    </div>
  );
}
