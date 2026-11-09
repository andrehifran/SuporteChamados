import Contador from "./Contador";

/* src/components/Header.jsx
Um componente React nada mais é do que uma função JavaScript que
retorna JSX!  */
export default function Header() {
  const usuarioLogado = "Técnico Suporte";

  return (
    <header className="header-container">
      <div className="header-content">
        <h2> Sistema de Chamados</h2>
        <span className="user-badge">Usuário: {usuarioLogado}</span>

        <Contador />
      </div>
    </header>
  );
}
