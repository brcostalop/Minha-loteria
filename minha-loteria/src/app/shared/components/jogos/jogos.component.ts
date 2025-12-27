import { Component, input } from '@angular/core';
import { LoteriaJogo } from '../../../models/loteria.model';

@Component({
  selector: 'app-jogos',
  imports: [],
  templateUrl: './jogos.component.html',
  styleUrl: './jogos.component.scss'
})
export class JogosComponent {

  jogo = input.required<LoteriaJogo>();
  index = input<number>(0);

}
