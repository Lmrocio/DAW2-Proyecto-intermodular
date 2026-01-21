import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simulator-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulator-card.component.html',
  styleUrls: ['./simulator-card.component.scss']
})
export class SimulatorCardComponent {
  @Input() title: string = 'Seguro';
  @Input() icon: string = 'shield';
}
