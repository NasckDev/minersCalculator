import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Operacao } from './types';
import { calcularIRPorOperacao, Resultado } from './utils/taxCalculator';
import FormOperacao from './components/OperationForm';
import IRCombinedChart from './components/IRBarChart';
import Header from './components/Header';
import Footer from './components/Footer';

const formatarBRL = (valor: number | undefined | null) => {
  if (valor === undefined || valor === null || isNaN(valor)) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

const App: React.FC = () => {
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [resultados, setResultados] = useState<Resultado[]>([]);

  // Calcula quantidade média atual para um ticker
  const calcularQuantidadeMediaAtual = (ticker: string): number => {
    let qm = 0;
    for (const op of operacoes) {
      if (op.ticker === ticker) {
        if (op.tipo === 'compra') {
          qm += op.quantidade;
        } else if (op.tipo === 'venda') {
          qm -= op.quantidade;
        }
      }
    }
    return qm;
  };

  // Função para obter a data da compra mais antiga para um ticker
  const dataCompraMaisAntiga = (ticker: string): Date | null => {
    const datasCompra = operacoes
      .filter(op => op.ticker === ticker && op.tipo === 'compra')
      .map(op => new Date(op.data));

    if (datasCompra.length === 0) return null;

    return new Date(Math.min(...datasCompra.map(d => d.getTime())));
  };

  // Função para adicionar operação com validação
  const adicionarOperacao = (op: Omit<Operacao, 'id'>) => {
    setErro(null); // limpa erro anterior

    if (op.tipo === 'venda') {
      const qmAtual = calcularQuantidadeMediaAtual(op.ticker);
      if (op.quantidade > qmAtual) {
        setErro(
          `Não é possível vender ${op.quantidade} ações de ${op.ticker}, pois você possui apenas ${qmAtual}.`
        );
        return;
      }

      const dataVenda = new Date(op.data);
      const dataCompra = dataCompraMaisAntiga(op.ticker);

      if (dataCompra && dataVenda < dataCompra) {
        setErro(
          `Não é possível registrar uma venda em ${op.data} antes da primeira compra da ação ${op.ticker} em ${dataCompra.toLocaleDateString()}.`
        );
        return;
      }
    }

    setOperacoes(prev => [...prev, { ...op, id: uuidv4() }]);
  };

  // Função para inserir operações de exemplo
  const adicionarOperacoesExemplo = () => {
    const exemplo: Omit<Operacao, 'id'>[] = [
      { data: '2025-07-21', tipo: 'compra', ticker: 'PETR4', preco: 25.9, quantidade: 100, taxaCorretagem: 8.5 },
      { data: '2025-07-22', tipo: 'compra', ticker: 'PETR4', preco: 26.4, quantidade: 200, taxaCorretagem: 8.5 },
      { data: '2025-07-23', tipo: 'compra', ticker: 'PETR4', preco: 27.87, quantidade: 100, taxaCorretagem: 8.5 },
      { data: '2025-07-24', tipo: 'venda', ticker: 'PETR4', preco: 26.53, quantidade: 100, taxaCorretagem: 8.5 },
      { data: '2025-07-25', tipo: 'venda', ticker: 'PETR4', preco: 27.39, quantidade: 100, taxaCorretagem: 8.5 },
    ];
    setOperacoes(exemplo.map(op => ({ ...op, id: uuidv4() })));
  };

  // Atualiza os resultados e erros quando 'operacoes' mudam
  useEffect(() => {
    setErro(null);
    try {
      const res = calcularIRPorOperacao(operacoes);
      setResultados(res);
    } catch (e: any) {
      setErro(e.message || 'Erro no cálculo');
      setResultados([]);
    }
  }, [operacoes]);

  const ultimoResultado: Resultado | undefined = resultados.at(-1);

  const tickersSugeridos = Array.from(new Set(operacoes.map(op => op.ticker)));

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h1 className="mb-1 fs-2 fw-bold title">Calculadora de IR para Ações</h1>
        <p className="mb-4 fs-6 fw-normal text-secondary">
          Calculadora Simplificada de Imposto de Renda para operações na Bolsa.
        </p>

        {/* Mostra erro se existir */}
        {erro && (
          <div className="alert alert-danger" role="alert">
            {erro}
          </div>
        )}

        {/* Formulário de cadastro da operação */}
        <div className="card custom-card p-5 mb-4 shadow-sm">
          <FormOperacao onAdd={adicionarOperacao} tickersSugeridos={tickersSugeridos} />
        </div>

        {/* Última operação */}
        {ultimoResultado && (
          <div className="card custom-card alert-card p-3 shadow-sm bg-white">
            <h6 className="mb-3 lbl ps-4 mb-5">Dados da última operação</h6>
            <div className="row text-center">
              {[
                { label: 'Preço Médio', value: formatarBRL(ultimoResultado.pm) },
                { label: 'Quantidade Média', value: ultimoResultado.qm },
                { label: 'Prejuízo Acumulado', value: formatarBRL(ultimoResultado.pa) },
                { label: 'Resultado da Venda', value: formatarBRL(ultimoResultado.ra) },
              ].map(({ label, value }) => (
                <div className="col" key={label}>
                  <p className="mb-1 fs-5 fw-bold data">{label}</p>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Histórico de operações */}
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
                    {['Data', 'Tipo', 'Ação', 'Preço', 'Quantidade', 'Corretagem', 'Resultado', 'IR'].map(
                      header => (
                        <th key={header}>{header}</th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {resultados.map(({ operacao, ra, ir }) => (
                    <tr key={operacao.id}>
                      <td className="date">
                        <span className="circle-date">{operacao.data}</span>
                      </td>
                      <td className={operacao.tipo === 'compra' ? 'text-success' : 'text-danger'}>
                        {operacao.tipo.toUpperCase()}
                      </td>
                      <td>{operacao.ticker}</td>
                      <td>{formatarBRL(operacao.preco)}</td>
                      <td>{operacao.quantidade}</td>
                      <td>{formatarBRL(operacao.taxaCorretagem)}</td>
                      <td>
                        {operacao.tipo === 'venda' ? (
                          <span className={`badge ${ra! >= 0 ? 'bg-success' : 'bg-danger'}`}>
                            {formatarBRL(ra)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {operacao.tipo === 'venda' ? (
                          <span className={`badge ${ir > 0 ? 'bg-danger' : 'bg-secondary'}`}>
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

            {/* Gráfico */}
            <div className="table-responsive mt-4">
              <h5 className="mb-1 fs-3 fw-bold sub-title">Gráfico de IR por Venda</h5>
              <p className="mb-4 fs-6 fw-normal text-secondary">
                Evolução do imposto de renda por operação de venda.
              </p>
              <IRCombinedChart resultados={resultados} />
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default App;
