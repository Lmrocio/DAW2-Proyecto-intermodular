// ============================================================================
// VALIDADORES ASÍNCRONOS - ClienteFase3
// ============================================================================
// Validadores que simulan llamadas a API para validación

import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AsyncValidatorsService {

  // Emails "ya registrados" (simulación de base de datos)
  private registeredEmails = [
    'admin@tecnomayores.com',
    'usuario@test.com',
    'ejemplo@gmail.com',
    'test@test.com'
  ];

  // Usernames "ya registrados" (simulación de base de datos)
  private registeredUsernames = [
    'admin',
    'usuario',
    'test',
    'pepe',
    'maria'
  ];

  // ========================================================================
  // VALIDADOR: EMAIL ÚNICO
  // ========================================================================
  /**
   * Valida que el email no esté ya registrado
   * Simula una llamada a API con delay
   */
  emailUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value?.toLowerCase();

      if (!email) {
        return of(null);
      }

      // Simular debounce + llamada API con delay
      return timer(800).pipe(
        switchMap(() => this.checkEmailAvailability(email)),
        map(isAvailable => isAvailable ? null : { emailTaken: true }),
        catchError(() => of(null)) // Si hay error de red, no bloquear
      );
    };
  }

  /**
   * Simula verificación de email en el servidor
   */
  private checkEmailAvailability(email: string): Observable<boolean> {
    console.log(`🔍 Verificando disponibilidad del email: ${email}`);
    const isAvailable = !this.registeredEmails.includes(email.toLowerCase());
    return of(isAvailable);
  }

  // ========================================================================
  // VALIDADOR: USERNAME DISPONIBLE
  // ========================================================================
  /**
   * Valida que el nombre de usuario esté disponible
   * Simula una llamada a API con delay
   */
  usernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value?.toLowerCase();

      if (!username || username.length < 3) {
        return of(null);
      }

      // Simular debounce + llamada API con delay
      return timer(600).pipe(
        switchMap(() => this.checkUsernameAvailability(username)),
        map(isAvailable => isAvailable ? null : { usernameTaken: true }),
        catchError(() => of(null))
      );
    };
  }

  /**
   * Simula verificación de username en el servidor
   */
  private checkUsernameAvailability(username: string): Observable<boolean> {
    console.log(`🔍 Verificando disponibilidad del username: ${username}`);
    const isAvailable = !this.registeredUsernames.includes(username.toLowerCase());
    return of(isAvailable);
  }

  // ========================================================================
  // VALIDADOR: NIF ÚNICO
  // ========================================================================
  /**
   * Valida que el NIF no esté ya registrado
   */
  nifUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const nif = control.value?.toUpperCase();

      if (!nif || nif.length !== 9) {
        return of(null);
      }

      return timer(500).pipe(
        switchMap(() => {
          // Simular que algunos NIFs ya están registrados
          const registeredNifs = ['12345678Z', '87654321X'];
          const isAvailable = !registeredNifs.includes(nif);
          console.log(`🔍 Verificando NIF: ${nif} - Disponible: ${isAvailable}`);
          return of(isAvailable);
        }),
        map(isAvailable => isAvailable ? null : { nifTaken: true }),
        catchError(() => of(null))
      );
    };
  }
}

