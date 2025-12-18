// ============================================================================
// COMPONENTE: FORMULARIO DE REGISTRO - ClienteFase3
// ============================================================================
// Formulario reactivo con validadores síncronos, asíncronos y FormArray

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

// Validadores personalizados
import {
  passwordStrength,
  passwordMatch,
  nifValidator,
  telefonoValidator,
  codigoPostalValidator,
  atLeastOneRequired
} from '../../../validators/custom.validators';

// Validadores asíncronos
import { AsyncValidatorsService } from '../../../validators/async.validators';

// Componentes UI
import { Button } from '../button/button';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss'
})
export class RegisterForm implements OnInit {

  // ========================================================================
  // PROPIEDADES
  // ========================================================================

  /** Formulario reactivo */
  registerForm!: FormGroup;

  /** Emite cuando el formulario se envía correctamente */
  @Output() formSubmit = new EventEmitter<any>();

  /** Indica si se muestra la contraseña */
  showPassword = false;
  showConfirmPassword = false;

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(
    private fb: FormBuilder,
    private asyncValidators: AsyncValidatorsService
  ) {}

  // ========================================================================
  // CICLO DE VIDA
  // ========================================================================

  ngOnInit(): void {
    this.initForm();
  }

  // ========================================================================
  // INICIALIZACIÓN DEL FORMULARIO
  // ========================================================================

  private initForm(): void {
    this.registerForm = this.fb.group({
      // Datos personales
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      nif: ['', {
        validators: [Validators.required, nifValidator()],
        asyncValidators: [this.asyncValidators.nifUnique()],
        updateOn: 'blur'
      }],
      fechaNacimiento: ['', [Validators.required]],

      // Datos de cuenta
      username: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
        asyncValidators: [this.asyncValidators.usernameAvailable()],
        updateOn: 'blur'
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.asyncValidators.emailUnique()],
        updateOn: 'blur'
      }],
      password: ['', [Validators.required, passwordStrength()]],
      confirmPassword: ['', [Validators.required]],

      // Contacto (al menos uno requerido)
      telefonoPrincipal: ['', [telefonoValidator()]],
      telefonoSecundario: ['', [telefonoValidator()]],

      // Dirección
      direccion: this.fb.group({
        calle: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        piso: [''],
        codigoPostal: ['', [Validators.required, codigoPostalValidator()]],
        ciudad: ['', [Validators.required]],
        provincia: ['', [Validators.required]]
      }),

      // Teléfonos adicionales (FormArray)
      telefonosAdicionales: this.fb.array([]),

      // Términos
      aceptaTerminos: [false, [Validators.requiredTrue]],
      recibirNewsletter: [false]

    }, {
      validators: [
        passwordMatch('password', 'confirmPassword'),
        atLeastOneRequired('telefonoPrincipal', 'telefonoSecundario')
      ]
    });
  }

  // ========================================================================
  // GETTERS PARA ACCESO FÁCIL A CONTROLES
  // ========================================================================

  get nombre() { return this.registerForm.get('nombre'); }
  get apellidos() { return this.registerForm.get('apellidos'); }
  get nif() { return this.registerForm.get('nif'); }
  get fechaNacimiento() { return this.registerForm.get('fechaNacimiento'); }
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get telefonoPrincipal() { return this.registerForm.get('telefonoPrincipal'); }
  get telefonoSecundario() { return this.registerForm.get('telefonoSecundario'); }
  get direccion() { return this.registerForm.get('direccion') as FormGroup; }
  get aceptaTerminos() { return this.registerForm.get('aceptaTerminos'); }

  get telefonosAdicionales(): FormArray {
    return this.registerForm.get('telefonosAdicionales') as FormArray;
  }

  // ========================================================================
  // FORMARRAY - TELÉFONOS ADICIONALES
  // ========================================================================

  /** Crea un nuevo grupo de teléfono */
  private newTelefono(): FormGroup {
    return this.fb.group({
      tipo: ['movil', [Validators.required]],
      numero: ['', [Validators.required, telefonoValidator()]]
    });
  }

  /** Añade un teléfono adicional */
  addTelefono(): void {
    if (this.telefonosAdicionales.length < 3) {
      this.telefonosAdicionales.push(this.newTelefono());
    }
  }

  /** Elimina un teléfono adicional */
  removeTelefono(index: number): void {
    this.telefonosAdicionales.removeAt(index);
  }

  // ========================================================================
  // UTILIDADES PARA ERRORES
  // ========================================================================

  /** Obtiene los errores de contraseña como lista */
  getPasswordErrors(): string[] {
    const errors = this.password?.errors;
    if (!errors) return [];

    const messages: string[] = [];
    if (errors['required']) messages.push('La contraseña es obligatoria');
    if (errors['minLength']) messages.push(`Mínimo ${errors['minLength'].required} caracteres`);
    if (errors['noUppercase']) messages.push('Debe contener al menos una mayúscula');
    if (errors['noLowercase']) messages.push('Debe contener al menos una minúscula');
    if (errors['noNumber']) messages.push('Debe contener al menos un número');
    if (errors['noSpecial']) messages.push('Debe contener al menos un carácter especial (!@#$%...)');

    return messages;
  }

  /** Mensaje de error genérico para un control */
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['email']) return 'Formato de email inválido';
    if (errors['invalidNif']) return errors['invalidNif'].message || 'NIF inválido';
    if (errors['invalidTelefono']) return 'Teléfono inválido (ej: 612345678)';
    if (errors['invalidCP']) return errors['invalidCP'].message || 'Código postal inválido';
    if (errors['emailTaken']) return 'Este email ya está registrado';
    if (errors['usernameTaken']) return 'Este nombre de usuario no está disponible';
    if (errors['nifTaken']) return 'Este NIF ya está registrado';

    return 'Error de validación';
  }

  // ========================================================================
  // TOGGLE VISIBILIDAD CONTRASEÑA
  // ========================================================================

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ========================================================================
  // ENVÍO DEL FORMULARIO
  // ========================================================================

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      this.registerForm.markAllAsTouched();
      console.log('Formulario inválido:', this.registerForm.errors);
      return;
    }

    console.log('Formulario válido:', this.registerForm.value);
    this.formSubmit.emit(this.registerForm.value);
  }

  /** Resetea el formulario */
  resetForm(): void {
    this.registerForm.reset();
    this.telefonosAdicionales.clear();
  }
}

