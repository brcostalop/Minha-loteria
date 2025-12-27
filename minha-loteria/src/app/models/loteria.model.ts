export interface LoteriaModel {
}

export interface LoteriaJogo {
    numeros: number[];
    concurso?: number;
}

export interface LoteriaConfig {
    id: string;
    nome: string;
    numeroMin: number;
    numeroMax: number;
    qtdSelecMin: number;
    qtdSelecMax: number;
    apiUrl: string
}

export const LOTERIA_CONFIGS: LoteriaConfig[] = [
    {
        id: 'megasena',
        nome: 'Mega-Sena',
        numeroMin: 1,
        numeroMax: 60,
        qtdSelecMin: 6,
        qtdSelecMax: 15,
        apiUrl: 'https://loteriascaixa-api.herokuapp.com/api/megasena',
    }
]