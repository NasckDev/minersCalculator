import { Operacao } from '../types';

export interface Resultado {
  operacao: Operacao;
  ir: number;  // imposto devido
  ra: number;  // resultado auferido da operação (lucro ou prejuízo)
  pm: number;  // preço médio atualizado
  qm: number;  // quantidade média atual
  pa: number;  // prejuízo acumulado
}

/**
 * Calcula o IR por operação, atualizando preço médio (PM),
 * quantidade média (QM), resultado auferido (RA)
 * e prejuízo acumulado (PA) para cada ativo.
 */
export function calcularIRPorOperacao(operacoes: Operacao[]): Resultado[] {
  const posicoes: Record<string, { pm: number; qm: number; pa: number }> = {};
  const resultados: Resultado[] = [];

  // Ordena operações por data crescente
  const opsOrdenadas = [...operacoes].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  for (const op of opsOrdenadas) {
    const ticker = op.ticker;
    if (!posicoes[ticker]) {
      posicoes[ticker] = { pm: 0, qm: 0, pa: 0 };
    }

    const pos = posicoes[ticker];
    let ra = 0;
    let ir = 0;

    if (op.tipo === 'compra') {
      // Compra: recalcula preço médio ponderado
      const totalCompra = pos.pm * pos.qm + op.preco * op.quantidade + op.taxaCorretagem;
      pos.qm += op.quantidade;
      pos.pm = totalCompra / pos.qm;
    } else {
      // Venda: calcula resultado da operação (RA)
      ra = (op.preco - pos.pm) * op.quantidade - op.taxaCorretagem;
      pos.qm -= op.quantidade;

      if (ra < 0) {
        // Prejuízo: acumula no PA (valor negativo)
        pos.pa += ra;
      } else if (ra > 0) {
        // Lucro: compensa com prejuízo acumulado (se houver) antes de calcular IR
        const abatimento = Math.min(ra, Math.abs(pos.pa));
        ir = (ra - abatimento) * 0.15; // alíquota fixa 15%
        pos.pa += abatimento; // reduz prejuízo acumulado (PA sobe, mas deve permanecer ≤ 0)
        if (pos.pa > 0) pos.pa = 0;
      }
    }

    resultados.push({ operacao: op, ir, ra, pm: pos.pm, qm: pos.qm, pa: pos.pa });
  }

  return resultados;
}
