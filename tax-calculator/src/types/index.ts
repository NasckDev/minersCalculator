export interface Operacao {
  id: string;
  data: string; // ISO date string
  tipo: 'compra' | 'venda';
  ticker: string;
  preco: number;
  quantidade: number;
  taxaCorretagem: number;
}

export interface Posicao {
  pm: number;  // preço médio
  qm: number;  // quantidade média
  pa: number;  // prejuízo acumulado
}
