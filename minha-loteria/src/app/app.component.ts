import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoteriasService } from './services/loterias.service';
import { LOTERIA_CONFIGS, LoteriaConfig, LoteriaJogo } from './models/loteria.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JogosComponent } from './shared/components/jogos/jogos.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, JogosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'minha-loteria';

  private loteriaService = inject(LoteriasService);

  infosConfigs = LOTERIA_CONFIGS;

  configSelecionada = signal<LoteriaConfig>(LOTERIA_CONFIGS[0]);
  qtdJogos = signal<number>(1);
  qtdNumeros = signal<number>(6);

  jogosGerados = signal<LoteriaJogo[]>([]);
  isLoading = signal<boolean>(false);
  mensagemErro = signal<string>('');

  onConfigChange() {
    const config = this.configSelecionada();
    this.qtdNumeros.set(config.qtdSelecMin);
    this.jogosGerados.set([]);
    this.mensagemErro.set('');
  }

  gerar() {
    this.isLoading.set(true);
    this.mensagemErro.set('');
    this.jogosGerados.set([]);

    const config = this.configSelecionada();
    const totalJogos = this.qtdJogos();
    const totalNumeros = this.qtdNumeros();

    if (totalNumeros < config.qtdSelecMin || totalNumeros > config.qtdSelecMax) {
      this.mensagemErro.set('Erro qtd');
      this.isLoading.set(false);
      return;
    }

    this.loteriaService.getCarregaHistorico(config).subscribe({
      next: (historicoSet) => {
        const jogos = this.loteriaService.gerarJogos(totalJogos, totalNumeros, config, historicoSet);

        this.jogosGerados.set(jogos);

        if (historicoSet.size > 0) {
          console.log(`Verificado contra ${historicoSet.size} resultados passados.`);
        }
        this.isLoading.set(false);
      },
      error: (erro) => {
        this.mensagemErro.set('Erro ao consultar API de resultados. Gerando sem validação de histórico.')
        const jogos = this.loteriaService.gerarJogos(totalJogos, totalNumeros, config, new Set());
        this.jogosGerados.set(jogos);
        this.isLoading.set(false);
      }

    })
  }
}
