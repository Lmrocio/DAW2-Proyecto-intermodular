import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Shield, RefreshCw, Gamepad2 } from 'lucide-angular';

@Component({
  selector: 'app-simuladores',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './simuladores.html',
  styleUrl: './simuladores.scss',
})
export class Simuladores {
  readonly Shield = Shield;
  readonly RefreshCw = RefreshCw;
  readonly Gamepad2 = Gamepad2;

  features = [
    {
      icon: this.Shield,
      title: '100% Seguro',
      description: 'Practica sin miedo. Nada de lo que hagas aquí afectará a tu dispositivo real.'
    },
    {
      icon: this.RefreshCw,
      title: 'Sin límites',
      description: 'Repite los ejercicios cuantas veces necesites hasta que te sientas seguro.'
    }
  ];
}

