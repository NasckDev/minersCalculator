import React, { useState } from 'react';
import { Operacao } from './types';
import { v4 as uuidv4 } from 'uuid';
import FormOperacao from './components/OperationForm';
import IRBarChart from './components/IRBarChart';
import { calcularIRPorOperacao } from './utils/taxCalculator';
import Header from './components/Header';


function App() {
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);

  function adicionarOperacao(op: Omit<Operacao, 'id'>) {
    setOperacoes(prev => [...prev, { ...op, id: uuidv4() }]);
  }

  const resultados = calcularIRPorOperacao(operacoes);
  const ultimoResultado = resultados[resultados.length - 1];

  return (
  <>
    <Header></Header>
    <div className="container mt-4">
      <h1 className="mb-1 fs-2 fw-bold title">Calculadora IR Bolsa</h1>
      <p className="mb-4 fs-6 fw-normal text-secondary">
        Calculadora Simplificada de Imposto de Renda para operações na Bolsa.
      </p>
      <div className="card custom-card p-5 mb-4 shadow-sm">
        <FormOperacao onAdd={adicionarOperacao} />
      </div>

      {ultimoResultado && (
      <div className="card custom-card p-3 shadow-sm bg-white">
      <h6 className="mb-3 lbl ps-4 mb-5">Dados da última operação</h6>
      <div className="row text-center">
      <div className="col">
        <p className="mb-1 fs-5 fw-bold data">Preço Médio </p>
        <p>R$ {ultimoResultado.pm?.toFixed(5) ?? 'N/A'}</p>
      </div>
      <div className="col">
        <p className="mb-1 fs-5 fw-bold data">Quantidade média</p>
        <p>{ultimoResultado.qm ?? 'N/A'}</p>
      </div>
      <div className="col">
        <p className="mb-1 fs-5 fw-bold data">Prejuízo acumulado</p>
        <p>R$ {ultimoResultado.pa?.toFixed(3) ?? 'N/A'}</p>
      </div>
    </div>
  </div>
)}

      

 <h2 className=" mb-1 fs-3 fw-bold sub-title ">Operações Registradas</h2>
 <p className="mb-4 fs-6 fw-normal text-secondary">
       Registro de operações de compras e vendas realizadas na Bolsa.
      </p>
<div className="table-responsive">
  <table className="table text-center my-table p-5 mb-4 shadow-sm">
    <thead className="table">
      <tr>
        <th>Data</th>
        <th>Tipo</th>
        <th>Ação</th>
        <th>Preço</th>
        <th>Quantidade</th>
        <th>Corretagem</th>
        <th>IR</th>
      </tr>
    </thead>
    <tbody>
      {resultados.map(({ operacao, ir }) => (
        <tr key={operacao.id}>
          <td className='date'><span className='circle-date'>{operacao.data}</span></td>
          <td className={operacao.tipo === 'compra' ? 'text-success' : 'text-danger'}>
        
            {operacao.tipo.toUpperCase()}
          
          </td>
          <td>{operacao.ticker}</td>
          <td>{"R$ " + operacao.preco.toFixed(2)}</td>
          <td>{operacao.quantidade}</td>
          <td>{"R$ " + operacao.taxaCorretagem.toFixed(2)}</td>
          <td>
            {operacao.tipo === 'venda' ? (
              <span className={`badge ${ir > 0 ? 'bg-danger' : 'bg-success'}`}>
                R$ {ir.toFixed(2)}
              </span>
            ) : (
              '-'
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    <button
      className="btn btn-primary btn-example"
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
      <div className="table-responsive">
        <h5 className="mb-1 fs-3 fw-bold sub-title">Gráfico de IR por Venda</h5>
        <p className="mb-4 fs-6 fw-normal text-secondary">
       Evolução do imposto de renda por operação de venda.
      </p>
        <IRBarChart resultados={resultados} />
      </div>
    )}

    </div>
</>

    
  );

}

export default App;
