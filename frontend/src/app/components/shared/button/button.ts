import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Componente Button reutilizable - Rediseñado
 *
 * Acepta dos interfaces:
 * NUEVA: type | variant (blue|orange|yellow|white|google|start|custom) | size (small|medium|large)
 * ANTIGUA (compatibilidad): variant (primary|secondary|ghost|danger) | size (sm|md|lg) | btnStyle
 *
 * Type: primary (con sombra) | secondary (sin sombra)
 * Variant: blue | orange | yellow | white | google | start | custom
 * Size: small | medium | large
 * Icon: left-arrow | right-arrow | google | user | play | stop | null
 * Estados: normal, hover, active, disabled
 *
 * Puede ser botón (<button>) o enlace (<a> con routerLink)
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button implements OnInit {
  @Input() text: string = '';

  @Input() type: 'primary' | 'secondary' | 'tertiary' = 'primary';

  @Input() variant: 'blue' | 'orange' | 'yellow' | 'white' | 'google' | 'start' | 'previous' | 'next' | 'custom' | 'primary' | 'secondary' | 'ghost' | 'danger' = 'custom';

  @Input() disabled: boolean = false;

  @Input() fullWidth: boolean = false;

  @Input() icon?: 'left-arrow' | 'right-arrow' | 'google' | 'user' | 'play' | 'stop' | null = null;

  @Input() iconPosition: 'left' | 'right' = 'left';

  @Input() label?: string;

  @Input() size: 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg' = 'medium';

  @Input() buttonType: 'button' | 'submit' | 'reset' = 'button';

  @Input() routerLink: string | any[] | null = null;

  @Input() btnStyle?: 'elevated' | 'flat'; // Compatibilidad antigua

  @Output() btnClick = new EventEmitter<void>();

  // Propiedades internas normalizadas
  private normalizedVariant: 'blue' | 'orange' | 'yellow' | 'white' | 'google' | 'start' | 'previous' | 'next' | 'custom' = 'custom';
  private normalizedSize: 'small' | 'medium' | 'large' = 'medium';
  private normalizedType: 'primary' | 'secondary' | 'tertiary' = 'primary';

  ngOnInit(): void {
    // Mapear valores antiguos a nuevos
    this.normalizeProperties();
  }

  private normalizeProperties(): void {
    // Mapear tamaños antiguos (sm, md, lg) a nuevos (small, medium, large)
    if (this.size === 'sm') {
      this.normalizedSize = 'small';
    } else if (this.size === 'md') {
      this.normalizedSize = 'medium';
    } else if (this.size === 'lg') {
      this.normalizedSize = 'large';
    } else {
      this.normalizedSize = this.size as 'small' | 'medium' | 'large';
    }

    // Mapear variantes antiguas a nuevas
    switch (this.variant) {
      case 'primary':
        this.normalizedVariant = 'yellow'; // Primary amarillo -> yellow
        this.normalizedType = 'primary'; // Con sombra
        break;
      case 'secondary':
        this.normalizedVariant = 'blue'; // Secondary azul -> blue
        this.normalizedType = 'primary'; // Con sombra
        break;
      case 'ghost':
        this.normalizedVariant = 'white'; // Ghost -> white
        this.normalizedType = 'secondary'; // Sin sombra
        break;
      case 'danger':
        // No tenemos variante danger en nuevos, usar custom
        this.normalizedVariant = 'custom';
        this.normalizedType = 'primary';
        break;
      default:
        this.normalizedVariant = this.variant as any;
        this.normalizedType = this.type;
    }

    // Si viene btnStyle antigua, mapear a type
    if (this.btnStyle === 'elevated') {
      this.normalizedType = 'primary';
    } else if (this.btnStyle === 'flat') {
      this.normalizedType = 'secondary';
    }
  }

  onClick(): void {
    if (!this.disabled) {
      this.btnClick.emit();
    }
  }

  getButtonClasses(): string {
    const classes = ['button'];

    classes.push(`button--${this.normalizedType}`);
    classes.push(`button--${this.normalizedVariant}`);
    classes.push(`button--${this.normalizedSize}`);

    if (this.disabled) {
      classes.push('button--disabled');
    }

    if (this.fullWidth) {
      classes.push('button--full-width');
    }

    // Si no hay texto visible (string vacío o solo espacios), marcamos como icon-only
    if (!this.text || this.text.toString().trim() === '') {
      classes.push('button--icon-only');
    }

    return classes.join(' ');
  }
}
