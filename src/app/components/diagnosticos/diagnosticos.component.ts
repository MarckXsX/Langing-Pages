import { Component } from '@angular/core';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';
import { AuthService } from '../../services/auth.service';
import { DbRegistrosService } from '../../services/db-registros.service';
import {
  TableModule,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { Button, ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { cambioDiagnostico } from '../../models/cambioDiagnostico';
import { cie10 } from '../../models/ci10';
import { DatePicker } from 'primeng/datepicker';
import { ToastService } from '../../services/toast.service';
import { DocServiceService } from '../../services/doc-generate';
import { Ci10Service } from '../../services/ci10.service';
import { Listbox } from 'primeng/listbox';
import { StatusDiagnostico } from '../../models/statusDiagnostico';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-diagnosticos',
  imports: [
    NavbarAdminComponent,
    TableModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    AutoComplete,
    ReactiveFormsModule,
    DatePicker,
    Listbox
  ],
  templateUrl: './diagnosticos.component.html',
  styleUrl: './diagnosticos.component.css',
})
export class DiagnosticosComponent {
  usuarios: any[] = [];
  expandedRows: { [s: string]: boolean } = {};

  CambioDiagnosticos!: cambioDiagnostico[]; // Lista de diagnósticos pendientes
  editDialogVisible = false; // Controla la visibilidad del diálogo de edición
  editForm!: FormGroup; // Formulario reactivo para editar el diagnóstico
  selectedDiagnostico!: cambioDiagnostico | null; // Diagnóstico seleccionado para editar
  userId!: string; // ID del usuario autenticado
  isSaving = false; // Indica si se está guardando el diagnóstico
  cie10Results: cie10[] = []; // Resultados de búsqueda de CIE-10
  status!: any; // Lista de estatus de diagnóstico
  selectedUsuario!: User; // Agrega esta propiedad


  constructor(
    private readonly userService: UserService,
    private fb: FormBuilder,
    private readonly toastService: ToastService,
    private dbService: DbRegistrosService,
    private docService: DocServiceService,
    private cie10Service: Ci10Service
  ) {}

  ngOnInit(): void {
    this.loadUsuariosDiagnosticos();

    this.status = [
      { label: 'Pendiente', value: StatusDiagnostico.PENDIENTE },
      { label: 'Aprobado', value: StatusDiagnostico.APROBADO }
    ]

    this.editForm = this.fb.group({
      numExpediente: [null, Validators.required],
      servicio: ['', Validators.required],
      fechaAlta: ['', Validators.required],
      diagnosticoEgreso: ['', Validators.required],
      diagnosticoCambiado: ['', Validators.required],
      motivoNoCambio: ['', Validators.required],
      estatus: [null,Validators.required],
    });

    
  }

  loadUsuariosDiagnosticos() {
    this.userService.getUsersDetails().subscribe({
      next: (response) => {
        // Si response.data es un arreglo de usuarios, cada uno debe tener cambioDiagnosticoList como arreglo
        this.usuarios = Array.isArray(response.data)
          ? response.data
          : [response.data];
        console.log(this.usuarios);
        // cada usuario tenga al menos un arreglo vacío
        this.usuarios.forEach((u) => {
          if (!Array.isArray(u.cambioDiagnosticoList)) {
            u.cambioDiagnosticoList = [];
          }
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  expandAll() {
    this.expandedRows = this.usuarios.reduce(
      (acc, user) => (acc[user.id] = true) && acc,
      {}
    );
  }

  collapseAll() {
    this.expandedRows = {};
  }

  openEditDialog(diagnostico: cambioDiagnostico, usuario: User) {
    this.selectedDiagnostico = diagnostico;
    this.selectedUsuario = usuario; // Guarda el usuario actual

    this.editForm.patchValue({
      ...diagnostico,
      numExpediente:  diagnostico.numExpediente 
    });
    this.editDialogVisible = true;
  }

  saveEdit() {
    if (!this.selectedDiagnostico || !this.selectedUsuario) return;
    this.isSaving = true;
    const formValue = this.editForm.value;
    const updated = { // Combina los valores del formulario con el diagnóstico seleccionado
      ...this.selectedDiagnostico,
      ...formValue,
      idUser: this.selectedUsuario.id, // Aquí capturas el id del usuario
      numExpediente: formValue.numExpediente?.codigo || formValue.numExpediente || null,
      estatus: formValue.estatus?.value || formValue.estatus
    }; 
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
        this.loadUsuariosDiagnosticos();
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

   deleteDiagnostico(diagnosticoId: number) {
    this.dbService.deleteDiagnostico(diagnosticoId).subscribe({
      next: (response) => {
        this.toastService.showToast(
          'Exito',
          'Se elimino correctamente el diagnostico',
          'success'
        );
        this.loadUsuariosDiagnosticos(); // Recarga la lista después de eliminar
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
}
