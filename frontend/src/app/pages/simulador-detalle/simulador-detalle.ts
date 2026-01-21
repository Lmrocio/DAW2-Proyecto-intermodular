import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Button } from '../../components/shared/button/button';
import { SpeechService } from '../../core/services/speech.service';
import { ToastService } from '../../services/toast.service';

interface SimuladorStep {
  number: number;
  title: string;
  description: string;
  hint?: string;
  highlight?: string;
  tip?: string;
  tipIcon?: string;
}

interface Simulador {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  totalSteps: number;
  currentStep: number;
  steps: SimuladorStep[];
}

/**
 * Componente de detalle de simulador
 * Muestra un simulador interactivo paso a paso
 */
@Component({
  selector: 'app-simulador-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, Button],
  templateUrl: './simulador-detalle.html',
  styleUrl: './simulador-detalle.scss'
})
export class SimuladorDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private speech = inject(SpeechService);
  private toast = inject(ToastService);

  simulador = signal<Simulador | null>(null);
  loading = signal<boolean>(false);
  currentStep = signal<number>(1);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSimulador(id);
    }

    // Demo: mostrar varios toasts al cargar para ver estilo
    setTimeout(() => {
      this.toast.show('Tu simulador se ha cargado correctamente', 'success', 4000, 'Cargado');
    }, 400);

    setTimeout(() => {
      this.toast.show('Nueva lección disponible en Lecciones', 'info', 5000, 'Novedad');
    }, 1200);

    setTimeout(() => {
      this.toast.show('Recuerda guardar tu progreso', 'warning', 6000, 'Aviso');
    }, 2200);
  }

  demoShowToasts(): void {
    this.toast.show('Acción completada con éxito', 'success', 3000, 'Éxito');
    this.toast.show('Este es un mensaje informativo', 'info', 3500, 'Info');
  }

  private loadSimulador(id: string): void {
    // Mock data - en producción vendría del backend
    const mockSimulador: Simulador = {
      id: id,
      titulo: 'Cómo hacer un Bizum',
      descripcion: 'Aprende a enviar dinero de forma rápida y segura',
      categoria: 'Banca Digital',
      totalSteps: 5,
      currentStep: 1,
      steps: [
        {
          number: 1,
          title: 'Entra en Bizum',
          description: 'Busca el botón de Bizum dentro de tu aplicación del banco. Suele tener un logotipo azul con una letra B.',
          hint: '¿No lo encuentras? A veces está dentro del menú de Transferencias.',
          highlight: 'Bizum',
          tip: '¿Qué es Bizum?',
          tipIcon: 'help'
        },
        {
          number: 2,
          title: 'Selecciona "Enviar dinero"',
          description: 'Una vez dentro de Bizum, pulsa en la opción "Enviar dinero" o "Hacer un Bizum".',
          highlight: 'Enviar dinero',
          tip: 'Puedes enviar hasta 500€ por operación'
        },
        {
          number: 3,
          title: 'Introduce el teléfono',
          description: 'Escribe el número de teléfono de la persona a la que quieres enviar el dinero. Debe tener Bizum activado.',
          hint: 'Verifica que el número sea correcto antes de continuar.',
          highlight: 'número de teléfono'
        },
        {
          number: 4,
          title: 'Indica la cantidad',
          description: 'Escribe cuánto dinero quieres enviar. Puedes añadir un mensaje opcional para el destinatario.',
          highlight: 'cantidad',
          tip: 'El dinero llega al instante'
        },
        {
          number: 5,
          title: 'Confirma y envía',
          description: 'Revisa todos los datos y confirma la operación. Necesitarás introducir tu clave o usar tu huella digital.',
          highlight: 'Confirmar',
          tip: 'Guarda el comprobante para futuras consultas',
          tipIcon: 'security'
        }
      ]
    };

    this.simulador.set(mockSimulador);
    this.currentStep.set(mockSimulador.currentStep);
  }

  getCurrentStepData(): SimuladorStep | undefined {
    return this.simulador()?.steps[this.currentStep() - 1];
  }

  getProgressPercentage(): number {
    const sim = this.simulador();
    if (!sim) return 0;
    return (this.currentStep() / sim.totalSteps) * 100;
  }

  nextStep(): void {
    const sim = this.simulador();
    if (sim && this.currentStep() < sim.totalSteps) {
      this.currentStep.update(step => step + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  async playInstructions(): Promise<void> {
    const stepData = this.getCurrentStepData();
    if (stepData) {
      try {
        await this.speech.speak(stepData.description);
      } catch (error) {
        console.error('Error al reproducir instrucciones:', error);
      }
    }
  }
}
