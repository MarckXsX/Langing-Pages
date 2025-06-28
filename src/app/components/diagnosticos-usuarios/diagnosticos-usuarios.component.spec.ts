import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticosUsuariosComponent } from './diagnosticos-usuarios.component';

describe('DiagnosticosUsuariosComponent', () => {
  let component: DiagnosticosUsuariosComponent;
  let fixture: ComponentFixture<DiagnosticosUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticosUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticosUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
