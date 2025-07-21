// src/types/index.ts

/** Representa uma operação de compra ou venda na bolsa */
export interface Operacao {
  id: string;
  data: string; // formato ISO (YYYY-MM-DD)
  tipo: 'compra' | 'venda';
  ticker: string;
  preco: number;
  quantidade: number;
  taxaCorretagem: number;
}

/** Representa a posição atual após uma operação */
export interface Posicao {
  pm: number;  // preço médio
  qm: number;  // quantidade média
  pa: number;  // prejuízo acumulado
}
