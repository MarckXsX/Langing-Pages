import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { NavbarComponent } from '../navbar/navbar.component';
import { cambioDiagnostico } from '../../models/cambioDiagnostico';
import { DbRegistrosService } from '../../services/db-registros.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { DocServiceService } from '../../services/doc-generate';
import { StatusDiagnostico } from '../../models/statusDiagnostico';
import { cie10 } from '../../models/ci10';
import { Ci10Service } from '../../services/ci10.service';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-diagnosticos-usuarios',
  imports: [
    ButtonModule,
    TableModule,
    RippleModule,
    NavbarComponent,
    DialogModule,
    ReactiveFormsModule,
    DatePicker,
    AutoComplete,
  ],
  templateUrl: './diagnosticos-usuarios.component.html',
  styleUrl: './diagnosticos-usuarios.component.css',
})

export class DiagnosticosUsuariosComponent {
  
  CambioDiagnosticos!: cambioDiagnostico[]; // Lista de diagnósticos pendientes
  editDialogVisible = false; // Controla la visibilidad del diálogo de edición
  editForm!: FormGroup;   // Formulario reactivo para editar el diagnóstico
  selectedDiagnostico!: cambioDiagnostico | null; // Diagnóstico seleccionado para editar
  userId!: string;  // ID del usuario autenticado
  isSaving = false; // Indica si se está guardando el diagnóstico
  estatus!: StatusDiagnostico; // Estatus del diagnóstico
  cie10Results: cie10[] = []; // Resultados de búsqueda de CIE-10

  constructor(
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private dbService: DbRegistrosService,
    private fb: FormBuilder,
    private docService: DocServiceService,
    private cie10Service: Ci10Service
  ) {}

  ngOnInit(): void {
    this.loadDiagnosticos();
    this.editForm = this.fb.group({
      numExpediente: ['', Validators.required],
      servicio: ['', Validators.required],
      fechaAlta: ['', Validators.required],
      diagnosticoEgreso: ['', Validators.required],
      diagnosticoCambiado: ['', Validators.required],
      motivoNoCambio: ['', Validators.required],
    });
    this.estatus = StatusDiagnostico.PENDIENTE; // Inicializa el estatus
  }

  loadDiagnosticos() {
    this.userService.getDetails().subscribe({
      next: (response) => {
        console.log('Usuario autenticado:', response);
        this.userId = response.data.id;
        const lista = response.data.cambioDiagnosticoList;
        const cambios = Array.isArray(lista) ? lista : lista ? [lista] : [];
        console.log(cambios);
        this.CambioDiagnosticos = cambios.filter(
          (cd) => cd.estatus === StatusDiagnostico.PENDIENTE
        );
      },
      error: (error) => {
        console.log(error);
        //this.toastService.showToast('Error','Error al cargar los usuarios','error');
      },
    });
  }

  deleteDiagnostico(diagnosticoId: number) {
    this.dbService.deleteDiagnostico(diagnosticoId).subscribe({
      next: (response) => {
        this.toastService.showToast(
          'Exito',
          'Se elimino correctamente el diagnostico',
          'success'
        );
        this.loadDiagnosticos(); // Recarga la lista después de eliminar
      },
      error: (error) => {
        //this.toast.showError('Error al eliminar el usuario');
        console.log(error);
        this.toastService.showToast(
          'Error',
          'Error al eliminar el diagnostico',
          'error'
        );
      },
    });
  }

  openEditDialog(diagnostico: cambioDiagnostico) {
    this.selectedDiagnostico = diagnostico;

    // Busca el objeto cie10 correspondiente al código actual
    this.editForm.patchValue({
      ...diagnostico,
      numExpediente: diagnostico.numExpediente // Si no lo encuentra, deja el string
    });

    this.editDialogVisible = true;
  }

  saveEdit() {
    if (!this.selectedDiagnostico) return;
    this.isSaving = true;
    const formValue = this.editForm.value;
    const updated = {
      ...this.selectedDiagnostico,
      ...this.editForm.value,
      idUser: this.userId,
      estatus: this.estatus,
      numExpediente: formValue.numExpediente?.codigo || formValue.numExpediente || null,
    };
    console.log('Datos actualizados:', updated);
    this.dbService.updateDiagnostico(updated.id, updated).subscribe({
      next: (response) => {
        console.log('Diagnóstico actualizado:', response);
        this.toastService.showToast(
          'Éxito',
          'Diagnóstico actualizado correctamente',
          'success'
        );
        this.editDialogVisible = false;
        this.isSaving = false;
        this.documentGenerate(response.data);
        this.loadDiagnosticos();
      },
      error: () => {
        this.toastService.showToast(
          'Error',
          'Error al actualizar el diagnóstico',
          'error'
        );
        this.isSaving = false;
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
