import { TestBed } from '@angular/core/testing';
import { SimuladoresStore } from './simuladores.store';
import { SimuladorService, Simulador } from '../services/simulador.service';
import { of } from 'rxjs';

describe('SimuladoresStore', () => {
  let store: SimuladoresStore;
  let mockService: Partial<SimuladorService>;
  let getAllCalls = 0;

  const mockSimuladores: Simulador[] = [
    {
      id: '1',
      titulo: 'Simulador Test 1',
      descripcion: 'Descripción test 1',
      categoria: 'Banca',
      duracion: '20 min',
      nivel: 'Básico'
    },
    {
      id: '2',
      titulo: 'Simulador Test 2',
      descripcion: 'Descripción test 2',
      categoria: 'Compras',
      duracion: '30 min',
      nivel: 'Intermedio'
    }
  ];

  beforeEach(() => {
    getAllCalls = 0;

    mockService = {
      getAllSimuladores: () => {
        getAllCalls++;
        return of(mockSimuladores);
      }
    };

    TestBed.configureTestingModule({
      providers: [
        SimuladoresStore,
        { provide: SimuladorService, useValue: mockService }
      ]
    });

    store = TestBed.inject(SimuladoresStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load simuladores on init', () => {
    expect(getAllCalls).toBeGreaterThan(0);
    expect(store.simuladores().length).toBe(2);
  });

  it('should calculate totalCount correctly', () => {
    expect(store.totalCount()).toBe(2);
  });

  it('should add simulador', () => {
    const newSimulador: Simulador = {
      id: '3',
      titulo: 'Nuevo Simulador',
      descripcion: 'Nueva descripción',
      categoria: 'Internet',
      duracion: '40 min',
      nivel: 'Avanzado'
    };

    const initialCount = store.totalCount();
    store.add(newSimulador);

    expect(store.totalCount()).toBe(initialCount + 1);
  });

  it('should update simulador', () => {
    const updated: Simulador = {
      ...mockSimuladores[0],
      titulo: 'Actualizado'
    };

    store.update(updated);

    const found = store.getById('1');
    expect(found?.titulo).toBe('Actualizado');
  });

  it('should remove simulador', () => {
    const initialCount = store.totalCount();
    store.remove('1');

    expect(store.totalCount()).toBe(initialCount - 1);
  });

  it('should search simuladores', () => {
    const results = store.search('Test 1');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('1');
  });

  it('should filter by categoria', () => {
    const results = store.getByCategoria('Banca');
    expect(results.length).toBe(1);
    expect(results[0].categoria).toBe('Banca');
  });

  it('should filter by nivel', () => {
    const results = store.getByNivel('Básico');
    expect(results.length).toBe(1);
    expect(results[0].nivel).toBe('Básico');
  });

  it('should refresh simuladores', () => {
    const callsBefore = getAllCalls;
    store.refresh();
    expect(getAllCalls).toBe(callsBefore + 1);
  });
});

