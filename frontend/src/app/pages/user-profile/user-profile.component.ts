import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Button } from '../../components/shared/button/button';
import { User } from '../../core/models/auth.model';

interface Badge {
  id: string;
  name: string;
  icon: string;
  color: 'yellow' | 'blue' | 'orange';
  unlocked: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'completed' | 'in-progress' | 'favorite';
}

/**
 * Página de Perfil de Usuario
 *
 * Muestra información del usuario, progreso, insignias y cursos completados.
 * Permite editar configuración, cambiar correo y contraseña.
 *
 * INTEGRACIÓN CON AUTH GUARD:
 * - Solo accesible para usuarios autenticados
 * - Muestra datos del usuario actual desde AuthService
 */
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    Button
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Usuario actual del AuthService
  currentUser = computed(() => this.authService.currentUser);
  isLoggedIn = computed(() => this.authService.isLoggedIn);

  // Configuración de accesibilidad
  textSize = signal<'normal' | 'large' | 'extra-large'>('normal');
  colorBlindMode = signal<boolean>(false);

  // Datos mock para progreso (en producción vendrían del backend)
  progress = signal<number>(60);
  completedLessons = signal<number>(6);
  totalLessons = signal<number>(10);

  badges = signal<Badge[]>([
    {
      id: '1',
      name: 'PIONERO',
      icon: 'stars',
      color: 'yellow',
      unlocked: true
    },
    {
      id: '2',
      name: 'CONSTANTE',
      icon: 'verified',
      color: 'blue',
      unlocked: true
    },
    {
      id: '3',
      name: 'MAESTRO',
      icon: 'emoji_events',
      color: 'orange',
      unlocked: false
    }
  ]);

  completedCourses = signal<Course[]>([
    {
      id: '1',
      title: 'Introducción a WhatsApp',
      description: 'Aprendiste a enviar mensajes, fotos y hacer llamadas con tus seres queridos.',
      image: 'https://placehold.co/400x300/22c55e/white?text=WhatsApp',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Navegación Segura',
      description: 'Claves para identificar enlaces peligrosos y proteger tus datos personales.',
      image: 'https://placehold.co/400x300/3b82f6/white?text=Seguridad',
      status: 'completed'
    }
  ]);

  favorites = signal<Course[]>([
    {
      id: '3',
      title: 'Videollamadas con la Familia',
      description: 'Guía paso a paso para usar Zoom y Google Meet sin miedo.',
      image: 'https://placehold.co/400x300/f59e0b/white?text=Videollamadas',
      status: 'favorite'
    }
  ]);

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    if (!this.authService.isLoggedIn) {
      console.log('❌ Usuario no autenticado, redirigiendo a login...');
      this.router.navigateByUrl('/login');
      return;
    }

    console.log('✅ Perfil cargado para:', this.currentUser()?.username);
    // En producción: cargar progreso, badges, cursos del backend
    // this.loadUserProgress();
  }

  /**
   * Obtener nombre para mostrar (username o email)
   */
  get displayName(): string {
    const user = this.currentUser();
    return user?.username || user?.email || 'Usuario';
  }

  /**
   * Obtener inicial del avatar
   */
  get avatarInitial(): string {
    const user = this.currentUser();
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  /**
   * Obtener fecha de registro formateada
   */
  get joinDate(): string {
    const user = this.currentUser();
    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    }
    return 'Fecha desconocida';
  }

  editProfile(): void {
    console.log('Editar perfil');
    this.router.navigateByUrl('/usuario/perfil');
  }

  changeTextSize(size: 'normal' | 'large' | 'extra-large'): void {
    this.textSize.set(size);
    console.log('Tamaño de texto cambiado a:', size);
    // En producción: guardar preferencia en backend o localStorage
    localStorage.setItem('textSize', size);
  }

  toggleColorBlindMode(): void {
    this.colorBlindMode.update(v => !v);
    console.log('Modo daltónicos:', this.colorBlindMode());
    // En producción: guardar preferencia en backend o localStorage
    localStorage.setItem('colorBlindMode', String(this.colorBlindMode()));
  }

  changeEmail(): void {
    console.log('Cambiar correo');
    alert('Función de cambiar correo en construcción');
  }

  changePassword(): void {
    console.log('Cambiar contraseña');
    alert('Función de cambiar contraseña en construcción');
  }

  /**
   * Cerrar sesión
   * Llama al AuthService para limpiar el estado y redirige al login
   */
  logout(): void {
    console.log('🔓 Cerrando sesión...');
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleFavorite(courseId: string): void {
    console.log('Toggle favorito para curso:', courseId);
    // En producción: llamar al backend para actualizar favoritos
  }
}
