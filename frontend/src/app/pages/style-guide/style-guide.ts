import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../components/shared/button/button';
import { Card } from '../../components/shared/card/card';
import { FormInput } from '../../components/shared/form-input/form-input';
import { FormTextarea } from '../../components/shared/form-textarea/form-textarea';
import { FormSelect, SelectOption } from '../../components/shared/form-select/form-select';
import { Alert } from '../../components/shared/alert/alert';

/**
 * Página Style Guide
 *
 * Muestra todos los componentes con todas sus variantes y estados
 * Utilizado para documentación visual, testing y referencia
 *
 * URL: /style-guide
 */
@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    Card,
    FormInput,
    FormTextarea,
    FormSelect,
    Alert,
  ],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss'
})
export class StyleGuide {
  // Opciones de ejemplo para select
  categoryOptions: SelectOption[] = [
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'JavaScript', value: 'js' },
    { label: 'Angular', value: 'angular' },
    { label: 'TypeScript', value: 'typescript' },
  ];

  difficultyOptions: SelectOption[] = [
    { label: 'Principiante', value: 'beginner' },
    { label: 'Intermedio', value: 'intermediate' },
    { label: 'Avanzado', value: 'advanced' },
  ];

  // Estados para mostrar/ocultar alertas
  alertStates: { [key: string]: boolean } = {
    success: true,
    error: true,
    warning: true,
    info: true
  };

  closeAlert(type: string): void {
    this.alertStates[type] = false;
  }

  showAlert(type: string): void {
    this.alertStates[type] = true;
  }
}

