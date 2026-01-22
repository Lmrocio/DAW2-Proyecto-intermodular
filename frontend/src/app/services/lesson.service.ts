// ============================================================================
// SERVICIO: LESSON SERVICE - ClienteFase2
// ============================================================================
// Servicio de datos para lecciones - Separación de responsabilidades
// La lógica de negocio está aquí, no en los componentes

import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, tap, finalize } from 'rxjs';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';

/**
 * Interfaz para lecciones
 */
export interface Lesson {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'facil' | 'medio' | 'avanzado';
  duration: number;
  image: string;
  imageVariants?: {
    small: string;
    medium: string;
    large: string;
  };
  completed: boolean;
  favorite: boolean;
}

@Injectable({ providedIn: 'root' })
export class LessonService {
  // ========================================================================
  // DATOS - En el futuro vendrán de una API
  // ========================================================================

  private lessonsData: Lesson[] = [
    {
      id: 1,
      title: 'Hacer una videollamada',
      description: 'Aprende a conectar con tu familia y amigos mediante videollamadas de WhatsApp.',
      category: 'WhatsApp',
      difficulty: 'facil',
      duration: 15,
      image: 'assets/images/imagen-1-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-1-small.webp',
        medium: 'assets/images/imagen-1-medium.webp',
        large: 'assets/images/imagen-1-large.webp'
      },
      completed: false,
      favorite: true
    },
    {
      id: 2,
      title: 'Enviar fotos por WhatsApp',
      description: 'Comparte tus fotos favoritas con tus contactos de forma sencilla.',
      category: 'WhatsApp',
      difficulty: 'facil',
      duration: 10,
      image: 'assets/images/imagen-2-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-2-small.webp',
        medium: 'assets/images/imagen-2-medium.webp',
        large: 'assets/images/imagen-2-large.webp'
      },
      completed: true,
      favorite: false
    },
    {
      id: 3,
      title: 'Buscar en Internet',
      description: 'Encuentra información de forma segura usando Google.',
      category: 'Internet',
      difficulty: 'facil',
      duration: 12,
      image: 'assets/images/imagen-3-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-3-small.webp',
        medium: 'assets/images/imagen-3-medium.webp',
        large: 'assets/images/imagen-3-large.webp'
      },
      completed: false,
      favorite: false
    },
    {
      id: 4,
      title: 'Usar el correo electrónico',
      description: 'Aprende a enviar y recibir correos electrónicos.',
      category: 'Correo',
      difficulty: 'medio',
      duration: 20,
      image: 'assets/images/imagen-4-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-4-small.webp',
        medium: 'assets/images/imagen-4-medium.webp',
        large: 'assets/images/imagen-4-large.webp'
      },
      completed: false,
      favorite: true
    },
    {
      id: 5,
      title: 'Ajustes del teléfono',
      description: 'Configura tu teléfono: brillo, sonido, tamaño de letra.',
      category: 'Smartphone',
      difficulty: 'medio',
      duration: 18,
      image: 'assets/images/imagen-5-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-5-small.webp',
        medium: 'assets/images/imagen-5-medium.webp',
        large: 'assets/images/imagen-5-large.webp'
      },
      completed: true,
      favorite: false
    },
    {
      id: 6,
      title: 'Seguridad en Internet',
      description: 'Protege tus datos y evita estafas online.',
      category: 'Seguridad',
      difficulty: 'avanzado',
      duration: 25,
      image: 'assets/images/imagen-6-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-6-small.webp',
        medium: 'assets/images/imagen-6-medium.webp',
        large: 'assets/images/imagen-6-large.webp'
      },
      completed: false,
      favorite: false
    }
  ];

  // ========================================================================
  // ESTADO REACTIVO
  // ========================================================================

  /** Subject para las lecciones */
  private lessonsSubject = new BehaviorSubject<Lesson[]>(this.lessonsData);

  /** Observable público de lecciones */
  public lessons$: Observable<Lesson[]> = this.lessonsSubject.asObservable();

  /** Signal para la lección seleccionada */
  public selectedLesson = signal<Lesson | null>(null);

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  // ========================================================================
  // MÉTODOS PÚBLICOS
  // ========================================================================

  /**
   * Obtiene todas las lecciones (simula llamada HTTP)
   */
  getLessons(): Observable<Lesson[]> {
    this.loadingService.show();

    return of(this.lessonsData).pipe(
      delay(500), // Simula latencia de red
      tap(() => this.lessonsSubject.next(this.lessonsData)),
      finalize(() => this.loadingService.hide())
    );
  }

  /**
   * Obtiene una lección por ID
   */
  getLessonById(id: number): Lesson | undefined {
    return this.lessonsData.find(l => l.id === id);
  }

  /**
   * Marca una lección como completada
   */
  completeLesson(lessonId: number): void {
    this.loadingService.show();

    // Simular petición al servidor
    setTimeout(() => {
      const lesson = this.lessonsData.find(l => l.id === lessonId);
      if (lesson) {
        lesson.completed = true;
        this.lessonsSubject.next([...this.lessonsData]);
        this.toastService.success('¡Lección completada! 🎉');
      }
      this.loadingService.hide();
    }, 800);
  }

  /**
   * Alterna el estado de favorito de una lección
   */
  toggleFavorite(lessonId: number): void {
    const lesson = this.lessonsData.find(l => l.id === lessonId);
    if (lesson) {
      lesson.favorite = !lesson.favorite;
      this.lessonsSubject.next([...this.lessonsData]);

      if (lesson.favorite) {
        this.toastService.info('Añadido a favoritos ⭐');
      } else {
        this.toastService.info('Quitado de favoritos');
      }
    }
  }

  /**
   * Selecciona una lección
   */
  selectLesson(lesson: Lesson | null): void {
    this.selectedLesson.set(lesson);
  }

  /**
   * Obtiene el progreso del usuario
   */
  getProgress(): { completed: number; total: number; percentage: number } {
    const completed = this.lessonsData.filter(l => l.completed).length;
    const total = this.lessonsData.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  }

  /**
   * Filtra lecciones por estado
   */
  filterLessons(filter: 'todas' | 'progreso' | 'favoritos', searchQuery = ''): Lesson[] {
    let result = [...this.lessonsData];

    // Filtrar por tab
    if (filter === 'progreso') {
      result = result.filter(l => l.completed);
    } else if (filter === 'favoritos') {
      result = result.filter(l => l.favorite);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.category.toLowerCase().includes(query)
      );
    }

    return result;
  }

  /**
   * Obtiene etiqueta de dificultad
   */
  getDifficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      facil: '🟢 Fácil',
      medio: '🟡 Intermedio',
      avanzado: '🔴 Avanzado'
    };
    return labels[difficulty] || difficulty;
  }
}

