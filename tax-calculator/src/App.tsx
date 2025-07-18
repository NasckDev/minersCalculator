import React, { useState } from 'react';
import { Operacao } from './types';
import { v4 as uuidv4 } from 'uuid';
import FormOperacao from './components/OperationForm';
import IRBarChart from './components/IRBarChart';
import { calcularIRPorOperacao } from './utils/taxCalculator';


function App() {
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);

  function adicionarOperacao(op: Omit<Operacao, 'id'>) {
    setOperacoes(prev => [...prev, { ...op, id: uuidv4() }]);
  }

  const resultados = calcularIRPorOperacao(operacoes);
  const ultimoResultado = resultados[resultados.length - 1];

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Calculadora IR Bolsa</h1>

      <div className="card p-3 mb-4 shadow-sm">
        <FormOperacao onAdd={adicionarOperacao} />
      </div>

      {ultimoResultado && (
        <div className="alert alert-info">
          <strong>Dados da última operação:</strong><br />
          PM: {ultimoResultado.pm?.toFixed(2) ?? 'N/A'}<br />
          QM: {ultimoResultado.qm ?? 'N/A'}<br />
          PA: {ultimoResultado.pa?.toFixed(2) ?? 'N/A'}
        </div>
      
      )}

      

      <h2>Operações Registradas</h2>
      <ul className="list-group mb-4">
        {resultados.map(({ operacao, ir }) => (
          <li key={operacao.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              {operacao.data} | {operacao.tipo.toUpperCase()} | {operacao.ticker} | 
              Preço: R$ {operacao.preco.toFixed(2)} | Quantidade: {operacao.quantidade} | 
              Corretagem: R$ {operacao.taxaCorretagem.toFixed(2)}
            </div>
            {operacao.tipo === 'venda' && (
              <span className={`badge ${ir > 0 ? 'bg-danger' : 'bg-success'}`}>
                IR: R$ {ir.toFixed(2)}
              </span>
            )}
          </li>
        ))}
      </ul>

    <button
      className="btn btn-primary mb-3"
      onClick={() => {
        const exemploOperacoes: Omit<Operacao, 'id'>[] = [
          { data: '2025-07-01', tipo: 'compra' as const, ticker: 'PETR4', preco: 25.90, quantidade: 100, taxaCorretagem: 8.50 },
          { data: '2025-07-02', tipo: 'compra' as const, ticker: 'PETR4', preco: 26.40, quantidade: 200, taxaCorretagem: 8.50 },
          { data: '2025-07-03', tipo: 'compra' as const, ticker: 'PETR4', preco: 27.87, quantidade: 100, taxaCorretagem: 8.50 },
          { data: '2025-07-04', tipo: 'venda'  as const, ticker: 'PETR4', preco: 26.53, quantidade: 100, taxaCorretagem: 8.50 },
          { data: '2025-07-05', tipo: 'venda'  as const, ticker: 'PETR4', preco: 27.39, quantidade: 100, taxaCorretagem: 8.50 },
        ];
        exemploOperacoes.forEach(op => adicionarOperacao(op));
      }}
    >
      Inserir Operações de Exemplo
    </button>
    {resultados.length > 0 && (
      <div className="card mb-4 p-3 shadow-sm">
        <h5 className="mb-3">Gráfico de IR por Venda</h5>
        <IRBarChart resultados={resultados} />
      </div>
    )}

    </div>

    
  );
}

export default App;
