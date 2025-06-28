import { Component } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { DocServiceService } from '../../services/doc-generate';
import { DbRegistrosService } from '../../services/db-registros.service';
import { GenericResponseDto } from '../../models/GenericResponseDto';
import { cambioDiagnostico } from '../../models/cambioDiagnostico';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Ci10Service } from '../../services/ci10.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { cie10 } from '../../models/ci10';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cambio-diagnostico',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    DatePicker,
    TextareaModule,
    NavbarComponent,
    AutoCompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cambio-diagnostico.component.html',
  styleUrl: './cambio-diagnostico.component.css',
})
export class CambioDiagnosticoComponent {
  formData!: FormGroup;
  idUser!: string; // Propiedad para guardar el id del usuario
  cie10Results: cie10[] = [];

  constructor(
    private fb: FormBuilder,
    private docService: DocServiceService,
    private dbService: DbRegistrosService,
    private toastService: ToastService,
    private userService: UserService, // Inyecta AuthService
    private cie10Service: Ci10Service
  ) {}

  ngOnInit(): void {

    //Implementar validacion en Campos
    this.formData = this.fb.group({
      servicio: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      numExpediente: [null, [Validators.required]],
      fechaAlta: ['', Validators.required],
      motivoNoCambio: [
        '',
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
      diagnosticoEgreso: [
        '',
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
      diagnosticoCambiado: [
        '',
        [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
      ],
    });
    
    // Llama a getDetails para obtener el id del usuario al iniciar el componente
    this.getDetails();
  }

  getDetails(){
    // Obtén el id del usuario al crear el componente
    this.userService.getDetails().subscribe({
      next: (response) => {
        this.idUser = response.data.id;
      },
      error: () => {
        this.toastService.showToast(
          'Error',
          'No se pudo obtener el usuario',
          'error'
        );
      },
    });
  }

  onSubmit() {
    if (this.formData.invalid) return;

    const raw = this.formData.getRawValue();
    raw.fechaAlta = new Date(raw.fechaAlta).toISOString().split('T')[0]; // Formatea la fecha antes de enviarla
    raw.idUser = this.idUser; // Agrega el id del usuario al objeto

    // Extrae solo el código del objeto seleccionado en el autocomplete
    raw.numExpediente = raw.numExpediente?.codigo || null;

    console.log('Datos del formulario:', raw);
    this.dbService.createDiagnostico(raw).subscribe({
      next: (response) => {
        console.log('Diagnóstico creado:', response);
        this.toastService.showToast(
          'Éxito',
          'Diagnóstico creado correctamente',
          'success'
        );
        this.formData.reset(); // Resetea el formulario después de enviar
        this.documentGenerate(response.data);
      },
      error: (error) => {
        console.error('Error al crear el diagnóstico:', error);
        this.toastService.showToast(
          'Error',
          'Error al crear el diagnóstico',
          'error'
        );
      },
    });
  }

  documentGenerate(raw: cambioDiagnostico) {
    this.docService.generateDocument(raw).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Diagnostico.docx';
        a.click();
        window.URL.revokeObjectURL(url);

        this.toastService.showToast(
          'Éxito',
          'Documento generado correctamente',
          'success'
        );
      },
      error: (err) => {
        console.error('Error al generar el documento:', err);
        this.toastService.showToast(
          'Error',
          'Error al generar el documento',
          'error'
        );
      },
    });
  }

  searchCie10(event: any) {
    const query = event.query;
    if (query && query.length > 1) {
      this.cie10Service.getCie10ByCode(query).subscribe({
        next: (results) => {
          this.cie10Results = results;
        },
        error: () => {
          this.cie10Results = [];
        },
      });
    } else {
      this.cie10Results = [];
    }
  }
}
