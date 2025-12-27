import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoteriasService } from './services/loterias.service';
import { LOTERIA_CONFIGS, LoteriaConfig, LoteriaJogo } from './models/loteria.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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
  }
}
