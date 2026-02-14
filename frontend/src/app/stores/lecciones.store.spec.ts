import { TestBed } from '@angular/core/testing';
import { LeccionesStore } from './lecciones.store';
import { LeccionService, Leccion } from '../services/leccion.service';
import { of } from 'rxjs';

describe('LeccionesStore', () => {
  let store: LeccionesStore;
  let mockService: Partial<LeccionService>;
  let getAllCalls = 0;

  const mockLecciones: Leccion[] = [
    {
      id: '1',
      titulo: 'Lección Test 1',
      descripcion: 'Descripción test 1',
      nivel: 'Básico',
      categoria: 'hardware',
      duracion: '30 min'
    },
    {
      id: '2',
      titulo: 'Lección Test 2',
      descripcion: 'Descripción test 2',
      nivel: 'Intermedio',
      categoria: 'software',
      duracion: '45 min'
    }
  ];

  beforeEach(() => {
    getAllCalls = 0;

    mockService = {
      getAllLecciones: () => {
        getAllCalls++;
        return of(mockLecciones);
      }
    };

    TestBed.configureTestingModule({
      providers: [
        LeccionesStore,
        { provide: LeccionService, useValue: mockService }
      ]
    });

    store = TestBed.inject(LeccionesStore);
  });

  describe('Inicialización', () => {
    it('should be created', () => {
      expect(store).toBeTruthy();
    });

    it('should load lecciones on init', () => {
      expect(getAllCalls).toBeGreaterThan(0);
      expect(store.lecciones().length).toBe(2);
    });
  });

  describe('Computed Signals', () => {
    it('should calculate totalCount correctly', () => {
      expect(store.totalCount()).toBe(2);
    });

    it('should calculate leccionesPorNivel correctly', () => {
      const porNivel = store.leccionesPorNivel();
      expect(porNivel.basico).toBe(1);
      expect(porNivel.intermedio).toBe(1);
      expect(porNivel.avanzado).toBe(0);
    });

    it('should calculate leccionesPorCategoria correctly', () => {
      const porCategoria = store.leccionesPorCategoria();
      expect(porCategoria['hardware']).toBe(1);
      expect(porCategoria['software']).toBe(1);
    });
  });

  describe('CRUD Operations', () => {
    it('should add leccion', () => {
      const newLeccion: Leccion = {
        id: '3',
        titulo: 'Nueva Lección',
        descripcion: 'Nueva descripción',
        nivel: 'Avanzado',
        categoria: 'internet',
        duracion: '60 min'
      };

      const initialCount = store.totalCount();
      store.add(newLeccion);

      expect(store.totalCount()).toBe(initialCount + 1);
    });

    it('should update leccion', () => {
      const updatedLeccion: Leccion = {
        ...mockLecciones[0],
        titulo: 'Título Actualizado'
      };

      store.update(updatedLeccion);

      const found = store.getById('1');
      expect(found?.titulo).toBe('Título Actualizado');
    });

    it('should remove leccion', () => {
      const initialCount = store.totalCount();
      store.remove('1');

      expect(store.totalCount()).toBe(initialCount - 1);
      expect(store.getById('1')).toBeUndefined();
    });
  });

  describe('Search and Filter', () => {
    it('should search lecciones by term', () => {
      const results = store.search('Test 1');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('1');
    });

    it('should filter by categoria', () => {
      const results = store.getByCategoria('hardware');
      expect(results.length).toBe(1);
      expect(results[0].categoria).toBe('hardware');
    });

    it('should filter by nivel', () => {
      const results = store.getByNivel('Básico');
      expect(results.length).toBe(1);
      expect(results[0].nivel).toBe('Básico');
    });
  });

  describe('Refresh', () => {
    it('should reload lecciones on refresh', () => {
      const callsBefore = getAllCalls;
      store.refresh();
      expect(getAllCalls).toBe(callsBefore + 1);
    });
  });
});

