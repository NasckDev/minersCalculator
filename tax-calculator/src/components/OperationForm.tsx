import React, { useState } from 'react';
import { Operacao } from '../types';

interface Props {
  onAdd: (op: Omit<Operacao, 'id'>) => void;
}

const FormOperacao: React.FC<Props> = ({ onAdd }) => {
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState<'compra' | 'venda'>('compra');
  const [ticker, setTicker] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [taxaCorretagem, setTaxaCorretagem] = useState('');

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

    // limpar campos
    setData('');
    setPreco('');
    setQuantidade('');
    setTaxaCorretagem('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Data da operação</label>
        <input type="date" className="form-control" value={data} onChange={e => setData(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Tipo</label>
        <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value as 'compra' | 'venda')}>
          <option value="compra">Compra</option>
          <option value="venda">Venda</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Ticker (ex: PETR4)</label>
        <input type="text" className="form-control" value={ticker} onChange={e => setTicker(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Preço da ação</label>
        <input type="number" step="0.01" className="form-control" value={preco} onChange={e => setPreco(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Quantidade</label>
        <input type="number" className="form-control" value={quantidade} onChange={e => setQuantidade(e.target.value)} />
      </div>

      <div className="mb-3">
        <label>Taxa de corretagem</label>
        <input type="number" step="0.01" className="form-control" value={taxaCorretagem} onChange={e => setTaxaCorretagem(e.target.value)} />
      </div>

      <button type="submit" className="btn btn-primary">Adicionar operação</button>
    </form>
  );
};

export default FormOperacao;
