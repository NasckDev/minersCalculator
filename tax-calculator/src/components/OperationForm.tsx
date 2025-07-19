import React, { useState } from 'react';
import { Operacao } from '../types';

interface Props {
  onAdd: (op: Omit<Operacao, 'id'>) => void;
}

const FormOperacao: React.FC<Props> = ({ onAdd }) => {
  // Estados controlados para cada campo
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState<'compra' | 'venda'>('compra');
  const [ticker, setTicker] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [taxaCorretagem, setTaxaCorretagem] = useState('');

  // Envio do formulário
  function handleSubmit(e: React.FormEvent) {
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

    setData('');
    setPreco('');
    setQuantidade('');
    setTaxaCorretagem('');
  }

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
        />
      </div>

      {/* Tipo da operação */}
      <div className="col-6">
        <label className="form-label">Tipo</label>
        <div className="btn-group w-100">
          <input
            type="radio"
            className="btn-check"
            id="tipo-compra"
            checked={tipo === 'compra'}
            onChange={() => setTipo('compra')}
          />
          <label className={`btn btn ${tipo === 'compra' ? 'btn-primary' : 'btn-outline-primary'}`} htmlFor="tipo-compra">
            Compra
          </label>

          <input
            type="radio"
            className="btn-check"
            id="tipo-venda"
            checked={tipo === 'venda'}
            onChange={() => setTipo('venda')}
          />
          <label className={`btn btn ${tipo === 'venda' ? 'btn-primary' : 'btn-outline-primary'}`} htmlFor="tipo-venda">
            Venda
          </label>
        </div>
      </div>

      {/* Ticker */}
      <div className="col-6">
        <label className="form-label">Nome da Ação</label>
        <input
          type="text"
          className="form-control"
          value={ticker}
          onChange={e => setTicker(e.target.value)}
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
            value={preco}
            onChange={e => setPreco(e.target.value)}
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
            onClick={() => setQuantidade(prev => (Number(prev) > 0 ? String(Number(prev) - 1) : '0'))}
          >
            –
          </button>
          <input
            type="number"
            className="form-control text-center"
            value={quantidade}
            onChange={e => setQuantidade(e.target.value)}
            min="0"
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setQuantidade(prev => String(Number(prev || '0') + 1))}
          >
            +
          </button>
        </div>
      </div>

      {/* Taxa de corretagem */}
      <div className="col-6">
        <label className="form-label">Taxa Corretagem</label>
        <div className="input-group">
          <span className="input-group-text">R$</span>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={taxaCorretagem}
            onChange={e => setTaxaCorretagem(e.target.value)}
          />
        </div>
      </div>

      {/* Botão de envio */}
      <div className="col-12 text-end">
        <button type="submit" className="btn btn-primary btn">
          Adicionar
        </button>
      </div>
    </form>
  );
};

export default FormOperacao;
