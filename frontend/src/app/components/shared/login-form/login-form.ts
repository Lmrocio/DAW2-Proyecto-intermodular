import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormInput } from '../form-input/form-input';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInput],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm implements OnInit {
  // ========================================================================
  // PROPIEDADES
  // ========================================================================

  /** Formulario reactivo para login */
  loginFormGroup: FormGroup;

  /** Emite los datos del formulario cuando se envía */
  @Output() loginSubmit = new EventEmitter<{ email: string; password: string; rememberMe: boolean }>();

  // ========================================================================
  // INYECCIÓN DE DEPENDENCIAS
  // ========================================================================

  constructor(private formBuilder: FormBuilder) {
    // Crear el formulario con validadores
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  // ========================================================================
  // CICLO DE VIDA
  // ========================================================================

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  // ========================================================================
  // MÉTODOS DE VALIDACIÓN
  // ========================================================================

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

  // ========================================================================
  // MANEJADORES DE EVENTOS
  // ========================================================================

  /**
   * Actualiza el valor del email en el formulario
   */
  onEmailChange(value: string): void {
    this.loginFormGroup.patchValue({ email: value });
  }

  /**
   * Actualiza el valor de la contraseña en el formulario
   */
  onPasswordChange(value: string): void {
    this.loginFormGroup.patchValue({ password: value });
  }

  /**
   * Maneja el envío del formulario
   * Solo se ejecuta si el formulario es válido
   */
  onSubmit(): void {
    if (this.loginFormGroup.valid) {
      const formData = {
        email: this.loginFormGroup.get('email')?.value || '',
        password: this.loginFormGroup.get('password')?.value || '',
        rememberMe: this.loginFormGroup.get('rememberMe')?.value || false,
      };

      // Emitir los datos del formulario al componente padre
      this.loginSubmit.emit(formData);

      // Aquí se llamaría a un servicio para autenticar al usuario
      console.log('Formulario válido. Datos:', formData);
    } else {
      console.log('Formulario inválido');
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.loginFormGroup.controls).forEach((key) => {
        this.loginFormGroup.get(key)?.markAsTouched();
      });
    }
  }
}


