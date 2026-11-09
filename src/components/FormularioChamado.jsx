// src/components/FormularioChamado.jsx
import { useState } from "react";

export default function FormularioChamado({ onAdicionarChamado }) {
  // Estados para controlar cada campo do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("Baixa");
  const [erro, setErro] = useState("");

  // Função disparada ao enviar o formulário
  function handleSubmit(e) {
    e.preventDefault(); // Impede o recarregamento da página

    // Validação simples de campos obrigatórios
    if (!titulo.trim() || !descricao.trim()) {
      setErro("Por favor, preencha o título e a descrição!");
      return;
    }

    // Cria o novo objeto de chamado
    const novoChamado = {
      id: Date.now(), // Gera um ID temporário único baseado no tempo
      titulo,
      descricao,
      prioridade,
      statusInicial: "Aberto",
      data: new Date().toLocaleDateString("pt-BR"),
    };

    // Envia o novo chamado para o componente pai (App.jsx)
    onAdicionarChamado(novoChamado);

    // Limpa o formulário e erros
    setTitulo("");
    setDescricao("");
    setPrioridade("Baixa");
    setErro("");
  }

  return (
    <form className="form-chamado" onSubmit={handleSubmit}>
      <h3>➕ Cadastrar Novo Chamado</h3>

      {/* Mensagem de erro de validação */}
      {erro && <div className="mensagem-erro">{erro}</div>}

      <div className="form-group">
        <label htmlFor="titulo">Título do Chamado:</label>
        <input
          id="titulo"
          type="text"
          placeholder="Ex: Teclado com defeito"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="descricao">Descrição do Problema:</label>
        <textarea
          id="descricao"
          rows="3"
          placeholder="Descreva o problema detalhadamente..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
        >
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
        </select>
      </div>

      <button type="submit" className="btn-salvar">
        Salvar Chamado
      </button>
    </form>
  );
}
