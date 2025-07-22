import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Operacao } from '../types';

interface Props {
  onAdd: (op: Omit<Operacao, 'id'>) => void;
  tickersSugeridos: string[];
}

// Função para formatar valor em moeda BRL enquanto digita
const formatarMoedaBRL = (valor: string): string => {
  const numeros = valor.replace(/\D/g, '');
  const centavos = numeros.slice(-2);
  const inteiros = numeros.slice(0, -2);
  const inteirosFormatados = inteiros
    ? parseInt(inteiros, 10).toLocaleString('pt-BR')
    : '0';
  return `R$ ${inteirosFormatados},${centavos.padStart(2, '0')}`;
};

// Converte string formatada para número float
const moedaParaNumero = (valor: string): number => {
  if (!valor) return 0;
  const somenteNumeros = valor.replace(/[^0-9,]/g, '');
  const valorPonto = somenteNumeros.replace(',', '.');
  return parseFloat(valorPonto) || 0;
};

const FormOperacao: React.FC<Props> = ({ onAdd, tickersSugeridos }) => {
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
      preco: moedaParaNumero(preco),
      quantidade: Number(quantidade),
      taxaCorretagem: moedaParaNumero(taxaCorretagem),
    });

    // reset form
    setData('');
    setTicker('');
    setPreco('');
    setQuantidade('');
    setTaxaCorretagem('');
  };

  const options = tickersSugeridos.map((t) => ({ value: t, label: t }));

  const alterarQuantidade = (delta: number) => {
    setQuantidade((prev) => {
      const atual = Number(prev || '0');
      return String(Math.max(atual + delta, 0));
    });
  };

  const handleChangeMoeda = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFunc: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const valor = e.target.value.replace(/^R\$\s?/, '');
    const valorFormatado = formatarMoedaBRL(valor);
    setFunc(valorFormatado);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      {/* Data */}
      <div className="col-12 col-md-6">
        <label className="form-label">Data</label>
        <input
          type="date"
          className="form-control"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
      </div>

      {/* Tipo */}
      <div className="col-12 col-md-6">
        <label className="form-label">Tipo</label>
        <div className="btn-group w-100 d-flex flex-wrap">
          {(['compra', 'venda'] as const).map((op) => (
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
      <div className="col-12 col-md-6">
        <label className="form-label">Nome da Ação</label>
        <CreatableSelect
          options={options}
          value={ticker ? { value: ticker, label: ticker } : null}
          onChange={(newValue) => {
            if (newValue) setTicker(newValue.value.toUpperCase());
            else setTicker('');
          }}
          onInputChange={(input, actionMeta) => {
            if (actionMeta.action === 'input-change') {
              setTicker(input.toUpperCase());
            }
          }}
          placeholder="Ex.: PETR4"
          isClearable
          formatCreateLabel={(inputValue) => `Adicionar "${inputValue.toUpperCase()}"`}
          noOptionsMessage={() => 'Nenhum resultado'}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>

      {/* Preço */}
      <div className="col-12 col-md-6">
        <label className="form-label">Preço</label>
        <input
          type="text"
          className="form-control"
          placeholder="R$ 0,00"
          value={preco}
          onChange={(e) => handleChangeMoeda(e, setPreco)}
          required
        />
      </div>

      {/* Quantidade */}
      <div className="col-12 col-md-6">
        <label className="form-label">Quantidade</label>
        <div className="input-group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => alterarQuantidade(-1)}
          >
            –
          </button>
          <input
            type="number"
            className="form-control text-center"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            min="0"
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => alterarQuantidade(1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Taxa de corretagem */}
      <div className="col-12 col-md-6">
        <label className="form-label">Taxa de Corretagem</label>
        <input
          type="text"
          className="form-control"
          placeholder="R$ 0,00"
          value={taxaCorretagem}
          onChange={(e) => handleChangeMoeda(e, setTaxaCorretagem)}
          required
        />
      </div>

      {/* Botão */}
      <div className="col-12 text-end">
        <button type="submit" className="btn btn-primary btn-ajustado">
          Adicionar
        </button>
      </div>
    </form>
  );
};

export default FormOperacao;
