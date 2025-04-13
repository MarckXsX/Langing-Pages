import { Component } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { ReactiveFormsModule, FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { DocServiceService } from '../../services/doc-service.service';

@Component({
  selector: 'app-cambio-diagnostico',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule,
    CommonModule, DatePicker, TextareaModule],
  templateUrl: './cambio-diagnostico.component.html',
  styleUrl: './cambio-diagnostico.component.css'
})
export class CambioDiagnosticoComponent {

  formData: FormGroup;

  constructor(private fb: FormBuilder, private docService: DocServiceService) {  //Implementar validacion en Campos
    this.formData = this.fb.group({
      servicio: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      numExpediente: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      fechaAlta: ['', Validators.required],
      motivoNoCambio: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      diagnosticoEgreso: ['', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
      diagnosticoCambiado: ['',[Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    });
  }

  onSubmit() {
    if (this.formData.invalid) return;

    const raw = this.formData.getRawValue();
    raw.fechaAlta = new Date(raw.fechaAlta).toISOString().split('T')[0]; // Formatea la fecha antes de enviarla

    this.docService.generateDocument(raw).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Diagnostico.docx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al generar el documento:', err);
      }
    });

  }
}
