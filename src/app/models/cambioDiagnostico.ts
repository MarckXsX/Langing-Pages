import { StatusDiagnostico } from "./statusDiagnostico";

export interface cambioDiagnostico {
    numExpediente: string;
    servicio: string;
    fechaAlta: Date;
    diagnosticoEgreso: string;
    diagnosticoCambiado: string;
    motivoNoCambio: string;
    idUser: number;
    estatus: StatusDiagnostico;
}