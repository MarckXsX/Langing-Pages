import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioDiagnosticoComponent } from './cambio-diagnostico.component';

describe('CambioDiagnosticoComponent', () => {
  let component: CambioDiagnosticoComponent;
  let fixture: ComponentFixture<CambioDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambioDiagnosticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
