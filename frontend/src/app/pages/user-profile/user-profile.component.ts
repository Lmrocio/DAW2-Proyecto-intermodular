import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Button } from '../../components/shared/button/button';

interface IUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  joinDate: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  badges: Badge[];
  completedCourses: Course[];
  favorites: Course[];
}

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

  user = signal<IUserProfile | null>(null);
  textSize = signal<'normal' | 'large' | 'extra-large'>('normal');
  colorBlindMode = signal<boolean>(false);

  ngOnInit(): void {
    // En producción, cargaría datos del backend
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    // Mock data - en producción vendría del backend
    const mockUser: IUserProfile = {
      id: '1',
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@example.com',
      avatar: 'assets/images/avatar-profile.jpg',
      joinDate: '2023',
      progress: 60,
      completedLessons: 6,
      totalLessons: 10,
      badges: [
        {
          id: '1',
          name: 'PIONERA',
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
          name: 'MAESTRA',
          icon: 'emoji_events',
          color: 'orange',
          unlocked: false
        }
      ],
      completedCourses: [
        {
          id: '1',
          title: 'Introducción a WhatsApp',
          description: 'Aprendiste a enviar mensajes, fotos y hacer llamadas con tus seres queridos.',
          image: 'assets/images/whatsapp-course.jpg',
          status: 'completed'
        },
        {
          id: '2',
          title: 'Navegación Segura',
          description: 'Claves para identificar enlaces peligrosos y proteger tus datos personales.',
          image: 'assets/images/security-course.jpg',
          status: 'completed'
        }
      ],
      favorites: [
        {
          id: '3',
          title: 'Videollamadas con la Familia',
          description: 'Guía paso a paso para usar Zoom y Google Meet sin miedo.',
          image: 'assets/images/videocalls-course.jpg',
          status: 'favorite'
        }
      ]
    };

    this.user.set(mockUser);
  }

  editProfile(): void {
    console.log('Editar perfil');
    // Navegar a página de edición
  }

  changeTextSize(size: 'normal' | 'large' | 'extra-large'): void {
    this.textSize.set(size);
    console.log('Tamaño de texto cambiado a:', size);
  }

  toggleColorBlindMode(): void {
    this.colorBlindMode.update(v => !v);
    console.log('Modo daltónicos:', this.colorBlindMode());
  }

  changeEmail(): void {
    console.log('Cambiar correo');
    alert('Función de cambiar correo en construcción');
  }

  changePassword(): void {
    console.log('Cambiar contraseña');
    alert('Función de cambiar contraseña en construcción');
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleFavorite(courseId: string): void {
    console.log('Toggle favorito para curso:', courseId);
  }
}
