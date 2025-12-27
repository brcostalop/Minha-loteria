import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoteriaConfig, LoteriaJogo } from '../models/loteria.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoteriasService {

  private http = inject(HttpClient);

  // constructor() { }
  getCarregaHistorico(config: LoteriaConfig): Observable<Set<string>> {
    return this.http.get<any[]>(config.apiUrl).pipe(
      map(results => {
        const historico = new Set<string>();
        results.forEach(res => {
          const numeros = res.dezenas ? res.dezenas.map((n:string) => parseInt(n)) : []
          historico.add(this.createSignature(numeros));
        });
        return historico;
      }),
      catchError(() => of(new Set<string>()))
    );
  }

  gerarJogos(totalJogos: number, numerosPorJogo: number, config: LoteriaConfig, historicoSignature: Set<string>): LoteriaJogo[] {
    const jogosGerados: LoteriaJogo[] = [];
    let tentativas = 0;
    const maxTentativas = totalJogos * 100;

    while (jogosGerados.length < totalJogos && tentativas < maxTentativas) {
      tentativas++;

      const novosNumeros = this.gerarNumerosSet(numerosPorJogo, config.numeroMin, config.numeroMax);
      const signature = this.createSignature(novosNumeros);

      const isHistoricoDuplicado = historicoSignature.has(signature);
      const isDuplicado = jogosGerados.some(g => this.createSignature(g.numeros) === signature);

      if (!isHistoricoDuplicado && !isDuplicado) {
        jogosGerados.push({numeros: novosNumeros});
      }

      if (tentativas >= maxTentativas) {
        console.warn('Não foi possível gerar jogos únicos suficientes.');
        
      }
    }

    return jogosGerados;
  }

  gerarNumerosSet(qtd: number, min: number, max: number): number[] {
    const numeros = new Set<number>();
    while (numeros.size < qtd) {
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      numeros.add(random);
    }

    return Array.from(numeros).sort((a, b) => a - b);
  }

  private createSignature(numeros: number[]): string {
    return numeros.sort((a, b) => a -b).join('-');
  }
}
