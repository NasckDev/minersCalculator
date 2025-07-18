import React, { useState } from 'react';
import { Operacao } from './types';
import { v4 as uuidv4 } from 'uuid';
import FormOperacao from './components/OperationForm';
import { calcularIRPorOperacao } from './utils/taxCalculator';

function App() {
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);

  function adicionarOperacao(op: Omit<Operacao, 'id'>) {
    setOperacoes(prev => [...prev, { ...op, id: uuidv4() }]);
  }

  const resultados = calcularIRPorOperacao(operacoes);

  // Pega o último resultado se houver
  const ultimoResultado = resultados[resultados.length - 1];

  return (
    <div className="container mt-4">
      <h1>Calculadora IR Bolsa</h1>
      <FormOperacao onAdd={adicionarOperacao} />

      <hr />

      {/* EXIBE PM, QM, PA se tiver */}
      {ultimoResultado && (
        <div className="alert alert-info">
          <strong>Dados da última operação:</strong><br />
          PM: {ultimoResultado.pm?.toFixed(2) ?? 'N/A'}<br />
          QM: {ultimoResultado.qm ?? 'N/A'}<br />
          PA: {ultimoResultado.pa?.toFixed(2) ?? 'N/A'}
        </div>
      )}

      <h2>Operações registradas</h2>
      <ul className="list-group">
        {resultados.map(({ operacao, ir }) => (
          <li key={operacao.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              {operacao.data} | {operacao.tipo.toUpperCase()} | {operacao.ticker} | Preço: R$ {operacao.preco.toFixed(2)} | Quantidade: {operacao.quantidade} | Corretagem: R$ {operacao.taxaCorretagem.toFixed(2)}
            </div>
            {operacao.tipo === 'venda' && (
              <span className={`badge ${ir > 0 ? 'bg-danger' : 'bg-success'}`}>
                IR: R$ {ir.toFixed(2)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
