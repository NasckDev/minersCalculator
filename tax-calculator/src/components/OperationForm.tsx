import React, { useState } from 'react';
import { Operacao } from '../types';

interface Props {
  onAdd: (op: Omit<Operacao, 'id'>) => void;
}

/** Formulário para adicionar operações de compra ou venda */
const FormOperacao: React.FC<Props> = ({ onAdd }) => {
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState<'compra' | 'venda'>('compra');
  const [ticker, setTicker] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [taxaCorretagem, setTaxaCorretagem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data || !ticker || !preco || !quantidade || !taxaCorretagem) {
      alert('Preencha todos os campos');
      return;
    }

    onAdd({
      data,
      tipo,
      ticker: ticker.toUpperCase(),
      preco: Number(preco),
      quantidade: Number(quantidade),
      taxaCorretagem: Number(taxaCorretagem),
    });

    // Reseta formulário
    setData('');
    setTicker('');
    setPreco('');
    setQuantidade('');
    setTaxaCorretagem('');
  };

  const incrementarQuantidade = () =>
    setQuantidade(prev => String(Number(prev || '0') + 1));

  const decrementarQuantidade = () =>
    setQuantidade(prev => (Number(prev) > 0 ? String(Number(prev) - 1) : '0'));

  return (
    <form onSubmit={handleSubmit} className="row g-4">
      {/* Data da operação */}
      <div className="col-6">
        <label className="form-label">Data</label>
        <input
          type="date"
          className="form-control"
          value={data}
          onChange={e => setData(e.target.value)}
          required
        />
      </div>

      {/* Tipo da operação */}
      <div className="col-6">
        <label className="form-label">Tipo</label>
        <div className="btn-group w-100">
          {(['compra', 'venda'] as const).map(op => (
            <React.Fragment key={op}>
              <input
                type="radio"
                className="btn-check"
                id={`tipo-${op}`}
                checked={tipo === op}
                onChange={() => setTipo(op)}
              />
              <label
                className={`btn ${tipo === op ? 'btn-primary' : 'btn-outline-primary'}`}
                htmlFor={`tipo-${op}`}
              >
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </label>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Ticker */}
      <div className="col-6">
        <label className="form-label">Nome da Ação</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex.: PETR4"
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          required
        />
      </div>

      {/* Preço da ação */}
      <div className="col-6">
        <label className="form-label">Preço</label>
        <div className="input-group">
          <span className="input-group-text">R$</span>
          <input
            type="number"
            className="form-control"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={preco}
            onChange={e => setPreco(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Quantidade */}
      <div className="col-6">
        <label className="form-label">Quantidade</label>
        <div className="input-group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={decrementarQuantidade}
          >
            –
          </button>
          <input
            type="number"
            className="form-control text-center"
            value={quantidade}
            onChange={e => setQuantidade(e.target.value)}
            min="0"
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={incrementarQuantidade}
          >
            +
          </button>
        </div>
      </div>

      {/* Taxa de corretagem */}
      <div className="col-6">
        <label className="form-label">Taxa de Corretagem</label>
        <div className="input-group">
          <span className="input-group-text">R$</span>
          <input
            type="number"
            step="0.01"
            className="form-control"
            placeholder="0,00"
            value={taxaCorretagem}
            onChange={e => setTaxaCorretagem(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Botão de envio */}
      <div className="col-12 text-end">
        <button type="submit" className="btn btn-primary">
          Adicionar
        </button>
      </div>
    </form>
  );
};

export default FormOperacao;
