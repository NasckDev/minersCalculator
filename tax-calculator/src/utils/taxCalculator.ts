import { Operacao } from '../types';

export interface Resultado {
  operacao: Operacao;
  ir: number;  // imposto devido
  ra: number;  // resultado auferido (lucro ou prejuízo)
  pm: number;  // preço médio atualizado
  qm: number;  // quantidade média atual
  pa: number;  // prejuízo acumulado
}

/**
 * Calcula IR, preço médio, quantidade média e prejuízo acumulado
 * para cada operação, por ticker, seguindo as regras da Receita.
 */
export function calcularIRPorOperacao(operacoes: Operacao[]): Resultado[] {
  const posicoes: Record<string, { pm: number; qm: number; pa: number }> = {};
  const resultados: Resultado[] = [];

  // Ordena operações por data crescente
  const opsOrdenadas = [...operacoes].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  for (const op of opsOrdenadas) {
    const ticker = op.ticker.toUpperCase();
    if (!posicoes[ticker]) {
      posicoes[ticker] = { pm: 0, qm: 0, pa: 0 };
    }

    const pos = posicoes[ticker];
    let ra = 0;
    let ir = 0;

    if (op.tipo === 'compra') {
      // Atualiza PM e QM na compra
      const totalCompra = pos.pm * pos.qm + op.preco * op.quantidade + op.taxaCorretagem;
      pos.qm += op.quantidade;
      pos.pm = pos.qm > 0 ? totalCompra / pos.qm : 0;

    } else if (op.tipo === 'venda') {
      // Valida se existe quantidade suficiente
      if (op.quantidade > pos.qm) {
        throw new Error(
          `Venda inválida: tentando vender ${op.quantidade} ações de ${ticker}, mas possui apenas ${pos.qm}.`
        );
      }

      // Calcula resultado da venda
      ra = (op.preco - pos.pm) * op.quantidade - op.taxaCorretagem;
      pos.qm -= op.quantidade;

      if (ra < 0) {
        // Prejuízo aumenta o prejuízo acumulado
        pos.pa += ra;
      } else if (ra > 0) {
        // Lucro: compensa prejuízo acumulado antes de calcular IR
        const compensacao = Math.min(ra, Math.abs(pos.pa));
        const lucroTributavel = ra - compensacao;

        ir = lucroTributavel * 0.15; // 15% sobre lucro após compensação
        pos.pa += compensacao; // PA é negativo, aumenta (vai para 0)

        // Se PA ficar positivo (não pode), zera
        if (pos.pa > 0) pos.pa = 0;
      }
    }

    resultados.push({
      operacao: op,
      ir,
      ra,
      pm: pos.pm,
      qm: pos.qm,
      pa: pos.pa
    });
  }

  return resultados;
}
