export const TIPOS_DENUNCIA = ['CACA', 'PESCA', 'MAUS_TRATOS', 'TRAFICO', 'ABANDONO', 'OUTRO'] as const;
export type TipoDenuncia = (typeof TIPOS_DENUNCIA)[number];