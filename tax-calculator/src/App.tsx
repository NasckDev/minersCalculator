import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Operacao } from './types';
import FormOperacao from './components/OperationForm';
import IRBarChart from './components/IRBarChart';
import Header from './components/Header';
import Footer from './components/Footer';
import { calcularIRPorOperacao } from './utils/taxCalculator';

const formatarBRL = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const App: React.FC = () => {
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);

  const adicionarOperacao = (op: Omit<Operacao, 'id'>) =>
    setOperacoes(prev => [...prev, { ...op, id: uuidv4() }]);

  const resultados = calcularIRPorOperacao(operacoes);
  const ultimoResultado = resultados.at(-1);

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h1 className="mb-1 fs-2 fw-bold title">Calculadora IR Bolsa</h1>
        <p className="mb-4 fs-6 fw-normal text-secondary">
          Calculadora Simplificada de Imposto de Renda para operações na Bolsa.
        </p>

        <div className="card custom-card p-5 mb-4 shadow-sm">
          <FormOperacao onAdd={adicionarOperacao} />
        </div>

        {ultimoResultado && (
          <div className="card custom-card alert-card p-3 shadow-sm bg-white">
            <h6 className="mb-3 lbl ps-4 mb-5">Dados da última operação</h6>
            <div className="row text-center">
              {[
                { label: 'Preço Médio', value: ultimoResultado.pm !== undefined ? formatarBRL(ultimoResultado.pm) : 'N/A' },
                { label: 'Quantidade média', value: ultimoResultado.qm ?? 'N/A' },
                { label: 'Prejuízo acumulado', value: ultimoResultado.pa !== undefined ? formatarBRL(ultimoResultado.pa) : 'N/A' },
              ].map(({ label, value }) => (
                <div className="col" key={label}>
                  <p className="mb-1 fs-5 fw-bold data">{label}</p>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Só exibe histórico se houver dados */}
        {resultados.length > 0 && (
          <>
            <h2 className="mb-1 fs-3 fw-bold sub-title">Histórico de Operações</h2>
            <p className="mb-4 fs-6 fw-normal text-secondary">
              Registro de operações de compras e vendas realizadas na Bolsa.
            </p>

            <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table text-center my-table p-5 mb-4 mt-2 shadow-sm">
                <thead>
                  <tr>
                    {['Data', 'Tipo', 'Ação', 'Preço', 'Quantidade', 'Corretagem', 'IR'].map(header => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultados.map(({ operacao, ir }) => (
                    <tr key={operacao.id}>
                      <td className="date"><span className="circle-date">{operacao.data}</span></td>
                      <td className={operacao.tipo === 'compra' ? 'text-success' : 'text-danger'}>
                        {operacao.tipo.toUpperCase()}
                      </td>
                      <td>{operacao.ticker}</td>
                      <td>{formatarBRL(operacao.preco)}</td>
                      <td>{operacao.quantidade}</td>
                      <td>{formatarBRL(operacao.taxaCorretagem)}</td>
                      <td>
                        {operacao.tipo === 'venda' ? (
                          <span className={`badge ${ir > 0 ? 'bg-danger' : 'bg-success'}`}>
                            {formatarBRL(ir)}
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

            <div className="table-responsive mt-4">
              <h5 className="mb-1 fs-3 fw-bold sub-title">Gráfico de IR por Venda</h5>
              <p className="mb-4 fs-6 fw-normal text-secondary">
                Evolução do imposto de renda por operação de venda.
              </p>
              <IRBarChart resultados={resultados} />
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default App;
