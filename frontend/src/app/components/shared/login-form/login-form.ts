import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Mail, Lock, Eye, EyeOff, Check, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm implements OnInit {
  // Iconos de Lucide
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Check = Check;
  readonly ArrowRight = ArrowRight;

  /** Formulario reactivo para login */
  loginFormGroup: FormGroup;

  /** Mostrar/ocultar contraseña */
  showPassword: boolean = false;

  /** Emite los datos del formulario cuando se envía */
  @Output() loginSubmit = new EventEmitter<{ email: string; password: string; rememberMe: boolean }>();

  constructor(private formBuilder: FormBuilder) {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Verifica si un campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginFormGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtiene el mensaje de error específico para el email
   */
  getEmailErrorMessage(): string {
    const emailControl = this.loginFormGroup.get('email');
    if (emailControl?.hasError('required')) {
      return 'El correo electrónico es obligatorio';
    }
    if (emailControl?.hasError('email')) {
      return 'Por favor, introduce un correo electrónico válido';
    }
    return '';
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.loginFormGroup.valid) {
      const formData = {
        email: this.loginFormGroup.get('email')?.value || '',
        password: this.loginFormGroup.get('password')?.value || '',
        rememberMe: this.loginFormGroup.get('rememberMe')?.value || false,
      };

      this.loginSubmit.emit(formData);
    }
  }
}

