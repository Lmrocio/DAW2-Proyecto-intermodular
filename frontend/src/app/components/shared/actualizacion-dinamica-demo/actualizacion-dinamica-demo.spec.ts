import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizacionDinamicaDemo } from './actualizacion-dinamica-demo';
import { ChangeDetectionStrategy } from '@angular/core';

describe('ActualizacionDinamicaDemo', () => {
  let component: ActualizacionDinamicaDemo;
  let fixture: ComponentFixture<ActualizacionDinamicaDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizacionDinamicaDemo]
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizacionDinamicaDemo);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have OnPush change detection', () => {
    const metadata = (component.constructor as any).__annotations__?.[0];
    expect(metadata?.changeDetection).toBe(ChangeDetectionStrategy.OnPush);
  });

  it('should inject stores', () => {
    expect(component.leccionesStore).toBeTruthy();
    expect(component.simuladoresStore).toBeTruthy();
  });

  it('should have trackBy functions', () => {
    expect(component.trackLeccionById).toBeDefined();
    expect(component.trackSimuladorById).toBeDefined();
  });

  it('should track leccion by id', () => {
    const mockLeccion: any = { id: '123', titulo: 'Test' };
    const result = component.trackLeccionById(0, mockLeccion);
    expect(result).toBe('123');
  });

  it('should track simulador by id', () => {
    const mockSimulador: any = { id: '456', titulo: 'Test' };
    const result = component.trackSimuladorById(0, mockSimulador);
    expect(result).toBe('456');
  });

  it('should handle null/undefined in trackBy', () => {
    const result1 = component.trackLeccionById(0, null as any);
    expect(result1).toBe('');

    const result2 = component.trackLeccionById(0, undefined as any);
    expect(result2).toBe('');
  });
});

