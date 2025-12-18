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
  // ========================================================================
  // PALETA DE COLORES
  // ========================================================================
  brandColors = [
    { name: 'Primary', variable: '$color-primary', value: '#f8d770', description: 'Color principal de la marca' },
    { name: 'Secondary', variable: '$color-secondary', value: '#ffb842', description: 'Color secundario' },
    { name: 'Tertiary', variable: '$color-tertiary', value: '#f3742b', description: 'Color terciario/acento cálido' },
    { name: 'Accent', variable: '$color-accent', value: '#0454b1', description: 'Color de acento (azul)' },
  ];

  semanticColors = [
    { name: 'Success', variable: '$color-success', value: '#74eb05', description: 'Éxito, confirmación' },
    { name: 'Error', variable: '$color-error', value: '#ff0000', description: 'Error, peligro' },
    { name: 'Warning', variable: '$color-warning', value: '#fde800', description: 'Advertencia, atención' },
    { name: 'Info', variable: '$color-info', value: '#00cffd', description: 'Información' },
  ];

  textColors = [
    { name: 'Text Dark', variable: '$color-text-dark', value: '#030303', description: 'Texto principal' },
    { name: 'Text Light', variable: '$color-text-light', value: '#fdfdfd', description: 'Texto sobre fondos oscuros' },
  ];

  backgroundColors = [
    { name: 'BG Light', variable: '$color-bg-light', value: '#fff6df', description: 'Fondo principal claro' },
  ];

  grayScale = [
    { name: 'Gray 50', variable: '$color-gray-50', value: '#fafafa' },
    { name: 'Gray 100', variable: '$color-gray-100', value: '#f5f5f5' },
    { name: 'Gray 200', variable: '$color-gray-200', value: '#e5e5e5' },
    { name: 'Gray 300', variable: '$color-gray-300', value: '#d4d4d4' },
    { name: 'Gray 400', variable: '$color-gray-400', value: '#a3a3a3' },
    { name: 'Gray 500', variable: '$color-gray-500', value: '#737373' },
    { name: 'Gray 600', variable: '$color-gray-600', value: '#525252' },
    { name: 'Gray 700', variable: '$color-gray-700', value: '#404040' },
    { name: 'Gray 800', variable: '$color-gray-800', value: '#262626' },
    { name: 'Gray 900', variable: '$color-gray-900', value: '#171717' },
  ];

  // ========================================================================
  // TIPOGRAFÍA
  // ========================================================================
  fontFamilies = [
    { name: 'Títulos', variable: '$font-primary', value: "'Arima Madurai', cursive", sample: 'Aprende tecnología' },
    { name: 'Subtítulos', variable: '$font-secondary', value: "'Glory', sans-serif", sample: 'Guía paso a paso' },
    { name: 'Texto', variable: '$font-body', value: "'Montserrat', sans-serif", sample: 'El veloz murciélago hindú comía feliz cardillo y kiwi.' },
    { name: 'Código', variable: '$font-mono', value: "'Fira Code', 'Courier New', monospace", sample: 'const x = 42;' },
  ];

  fontSizes = [
    { name: 'XS', variable: '$font-size-xs', value: '0.75rem', px: '12px' },
    { name: 'SM', variable: '$font-size-sm', value: '0.875rem', px: '14px' },
    { name: 'Base', variable: '$font-size-base', value: '1rem', px: '16px' },
    { name: 'LG', variable: '$font-size-lg', value: '1.25rem', px: '20px' },
    { name: 'XL', variable: '$font-size-xl', value: '1.5625rem', px: '25px' },
    { name: '2XL', variable: '$font-size-2xl', value: '1.95313rem', px: '31px' },
    { name: '3XL', variable: '$font-size-3xl', value: '2.44141rem', px: '39px' },
    { name: '4XL', variable: '$font-size-4xl', value: '3.05176rem', px: '49px' },
    { name: '5XL', variable: '$font-size-5xl', value: '3.8147rem', px: '61px' },
  ];

  fontWeights = [
    { name: 'Light', variable: '$font-weight-light', value: '300' },
    { name: 'Regular', variable: '$font-weight-regular', value: '400' },
    { name: 'Medium', variable: '$font-weight-medium', value: '500' },
    { name: 'Semibold', variable: '$font-weight-semibold', value: '600' },
    { name: 'Bold', variable: '$font-weight-bold', value: '700' },
  ];

  lineHeights = [
    { name: 'Tight', variable: '$line-height-tight', value: '1.2' },
    { name: 'Normal', variable: '$line-height-normal', value: '1.5' },
    { name: 'Relaxed', variable: '$line-height-relaxed', value: '1.75' },
    { name: 'Loose', variable: '$line-height-loose', value: '2' },
  ];

  // ========================================================================
  // ESPACIADO
  // ========================================================================
  spacings = [
    { name: '1', variable: '$spacing-1', value: '0.25rem', px: '4px' },
    { name: '2', variable: '$spacing-2', value: '0.5rem', px: '8px' },
    { name: '3', variable: '$spacing-3', value: '0.75rem', px: '12px' },
    { name: '4', variable: '$spacing-4', value: '1rem', px: '16px' },
    { name: '5', variable: '$spacing-5', value: '1.25rem', px: '20px' },
    { name: '6', variable: '$spacing-6', value: '1.5rem', px: '24px' },
    { name: '8', variable: '$spacing-8', value: '2rem', px: '32px' },
    { name: '10', variable: '$spacing-10', value: '2.5rem', px: '40px' },
    { name: '12', variable: '$spacing-12', value: '3rem', px: '48px' },
    { name: '16', variable: '$spacing-16', value: '4rem', px: '64px' },
    { name: '20', variable: '$spacing-20', value: '5rem', px: '80px' },
    { name: '24', variable: '$spacing-24', value: '6rem', px: '96px' },
  ];

  // ========================================================================
  // BORDER RADIUS
  // ========================================================================
  radiuses = [
    { name: 'SM', variable: '$radius-sm', value: '0.125rem', px: '2px' },
    { name: 'Base', variable: '$radius-base', value: '0.375rem', px: '6px' },
    { name: 'MD', variable: '$radius-md', value: '0.5rem', px: '8px' },
    { name: 'LG', variable: '$radius-lg', value: '0.75rem', px: '12px' },
    { name: 'XL', variable: '$radius-xl', value: '1rem', px: '16px' },
    { name: '2XL', variable: '$radius-2xl', value: '1.5rem', px: '24px' },
    { name: 'Full', variable: '$radius-full', value: '9999px', px: '∞' },
  ];

  // ========================================================================
  // SOMBRAS
  // ========================================================================
  shadows = [
    { name: 'SM', variable: '$shadow-sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    { name: 'MD', variable: '$shadow-md', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    { name: 'LG', variable: '$shadow-lg', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
    { name: 'XL', variable: '$shadow-xl', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    { name: '2XL', variable: '$shadow-2xl', value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  ];

  // ========================================================================
  // BREAKPOINTS
  // ========================================================================
  breakpoints = [
    { name: 'SM', variable: '$breakpoint-sm', value: '640px', description: 'Móviles grandes' },
    { name: 'MD', variable: '$breakpoint-md', value: '768px', description: 'Tablets' },
    { name: 'LG', variable: '$breakpoint-lg', value: '1024px', description: 'Laptops' },
    { name: 'XL', variable: '$breakpoint-xl', value: '1280px', description: 'Desktop' },
    { name: '2XL', variable: '$breakpoint-2xl', value: '1536px', description: 'Desktop grande' },
  ];

  // ========================================================================
  // TRANSICIONES
  // ========================================================================
  transitions = [
    { name: 'Fast', variable: '$transition-fast', value: '150ms' },
    { name: 'Base', variable: '$transition-base', value: '300ms' },
    { name: 'Slow', variable: '$transition-slow', value: '500ms' },
  ];

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

  // ========================================================================
  // CARDS - EJEMPLOS CON IMÁGENES
  // ========================================================================
  exampleCards = [
    {
      title: 'Desarrollo Web Frontend',
      description: 'Aprende HTML, CSS y JavaScript desde cero hasta nivel avanzado.',
      image: 'assets/images/imagen-1.svg'
    },
    {
      title: 'Frameworks Modernos',
      description: 'Domina Angular, React y Vue.js con proyectos prácticos.',
      image: 'assets/images/imagen-2.svg'
    },
    {
      title: 'Backend y APIs',
      description: 'Construye servidores robustos y APIs RESTful con Node.js.',
      image: 'assets/images/imagen-3.svg'
    },
    {
      title: 'Base de Datos',
      description: 'Gestiona datos eficientemente con SQL y NoSQL.',
      image: 'assets/images/imagen-4.svg'
    },
    {
      title: 'DevOps y Deployment',
      description: 'Despliega aplicaciones con Docker, CI/CD y cloud services.',
      image: 'assets/images/imagen-5.svg'
    },
    {
      title: 'Experiencia de Usuario',
      description: 'Diseña interfaces intuitivas y accesibles para todos los usuarios.',
      image: 'assets/images/imagen-6.svg'
    }
  ];

  // Cards horizontales para demostrar variantes
  exampleHorizontalCards = [
    {
      title: 'Proyecto Colaborativo',
      description: 'Trabaja en equipo usando Git, GitHub y metodologías ágiles para crear aplicaciones web completas.',
      image: 'assets/images/imagen-7.svg'
    },
    {
      title: 'Curso de JavaScript Avanzado',
      description: 'Profundiza en conceptos avanzados como closures, async/await, y patrones de diseño.',
      image: 'assets/images/imagen-1.svg'
    }
  ];

  // Método para copiar al portapapeles
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Feedback visual podría añadirse aquí
    });
  }

  // Determinar si el texto debe ser claro u oscuro según el fondo
  getTextColor(bgColor: string): string {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#030303' : '#fdfdfd';
  }
}

