import { Operacao } from '../types';

interface Resultado {
  operacao: Operacao;
  ir: number;
  pm: number; // Preço médio
  qm: number; // Quantidade média
  pa: number; // Prejuízo acumulado
}

export function calcularIRPorOperacao(operacoes: Operacao[]): Resultado[] {
  const posicoes: Record<string, { pm: number; qm: number; pa: number }> = {};
  const resultados: Resultado[] = [];

  // Ordena operações por data crescente
  const opsOrdenadas = [...operacoes].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  for (const op of opsOrdenadas) {
    const ticker = op.ticker;
    if (!posicoes[ticker]) {
      posicoes[ticker] = { pm: 0, qm: 0, pa: 0 };
    }
    const pos = posicoes[ticker];

    if (op.tipo === 'compra') {
      const totalCompra = pos.pm * pos.qm + op.preco * op.quantidade + op.taxaCorretagem;
      pos.qm += op.quantidade;
      pos.pm = totalCompra / pos.qm;
      resultados.push({ operacao: op, ir: 0, pm: pos.pm, qm: pos.qm, pa: pos.pa });
    } else {
      const ra = (op.preco - pos.pm) * op.quantidade - op.taxaCorretagem;
        pos.qm -= op.quantidade;
        let ir = 0;
        if (ra < 0) {
        pos.pa += ra; // pos.pa é negativo
        } else if (ra > 0) {
        const abatimento = Math.min(ra, Math.abs(pos.pa));
        ir = (ra - abatimento) * 0.15;
        pos.pa += abatimento; // abatimento positivo reduz prejuízo acumulado negativo
        if (pos.pa > 0) pos.pa = 0; // prevenir que PA vire positivo
        }

      resultados.push({ operacao: op, ir, pm: pos.pm, qm: pos.qm, pa: pos.pa });
    }
  }

  return resultados;
}
