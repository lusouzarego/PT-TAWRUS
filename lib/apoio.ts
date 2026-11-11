// "Vídeo de apoio": para cada exercício, o reel salvo do Instagram onde ele é mais fácil de achar.
// O Instagram não abre um reel num segundo específico, então junto do link vai a posição do
// exercício no vídeo ("é o 3º de 5"), tirada da ordem dos exercícios em cada post salvo.
// Preferência: reel só com esse exercício > ele é o 1º do reel > reel com menos exercícios.
import linhas from "../data/instagram-exercicios.json";

export type Apoio = { link: string; author: string; pos: number; total: number };

type Linha = { post: number; exercicio_id: string; autor: string; link: string };

function calcular(): Record<string, Apoio> {
  const porPost = new Map<number, Linha[]>();
  for (const l of linhas as Linha[]) {
    const lista = porPost.get(l.post) ?? [];
    lista.push(l);
    porPost.set(l.post, lista);
  }
  const melhor: Record<string, Apoio> = {};
  const nota = (a: Apoio) => (a.total === 1 ? 0 : a.pos === 1 ? 1 : 2) * 1000 + a.total * 10 + a.pos;
  for (const lista of porPost.values()) {
    // Ordem dos exercícios no vídeo, contando cada exercício uma vez (variações repetidas no mesmo post).
    const ordem = [...new Set(lista.map((l) => l.exercicio_id))];
    ordem.forEach((id, i) => {
      const l = lista.find((x) => x.exercicio_id === id)!;
      const a: Apoio = { link: l.link, author: l.autor, pos: i + 1, total: ordem.length };
      const atual = melhor[id];
      if (!atual || nota(a) < nota(atual)) melhor[id] = a;
    });
  }
  return melhor;
}

export const APOIO = calcular();
