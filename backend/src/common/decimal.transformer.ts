// O MySQL devolve DECIMAL como texto. Isto converte para número.
export const decimalParaNumero = {
    to: (valor?: number | null) => valor,
    from: (valor: string | null) => (valor === null ? null : parseFloat(valor)),
};