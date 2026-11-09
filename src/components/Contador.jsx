// src/components/Contador.jsx
import { useState } from "react";

export default function Contador() {
  // Estado para guardar a quantidade de chamados resolvidos pelo usuário
  const [resolvidos, setResolvidos] = useState(0);

  return (
    <div className="contador-container">
      <span className="contador-texto">
        Resolvidos hoje: <strong>{resolvidos}</strong>
      </span>

      <div className="contador-botoes">
        {/* Incrementa o estado em +1 */}
        <button
          className="btn-contador btn-incrementar"
          onClick={() => setResolvidos(resolvidos + 1)}
        >
          +1 Resolvido
        </button>

        {/* Reseta o estado para 0 */}
        <button
          className="btn-contador btn-zerar"
          onClick={() => setResolvidos(0)}
        >
          Zerar
        </button>
      </div>
    </div>
  );
}
