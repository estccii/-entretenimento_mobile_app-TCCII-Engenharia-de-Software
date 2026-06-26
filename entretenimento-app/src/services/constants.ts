interface CategoriaInfo {
  nome: string;
  icone: string;
}

export const CATEGORIA_MAP: Record<string, CategoriaInfo> = {
  filme: { nome: 'Filme', icone: '🎞️' },
  serie: { nome: 'Série', icone: '📺' },
  anime: { nome: 'Anime', icone: '🥷' },
};

export const CATEGORIA_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORIA_MAP).map(([key, value]) => [value.nome, key]),
);

export const SECOES = [
  { key: 'filme', titulo: 'Filmes', icone: '🎞️' },
  { key: 'serie', titulo: 'Séries', icone: '📺' },
  { key: 'anime', titulo: 'Animes', icone: '🥷' },
] as const;

export const PICKER_ITENS = [
  { label: 'Selecione um tipo:', value: '' },
  { label: '🎞️ Filme', value: 'filme' },
  { label: '📺 Série', value: 'serie' },
  { label: '🥷 Anime', value: 'anime' },
] as const;
