import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cambioDiagnostico } from '../models/cambioDiagnostico';
import { Observable } from 'rxjs';
import { GenericResponseDto } from '../models/GenericResponseDto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DbRegistrosService {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDiagnosticos(): Observable<GenericResponseDto<cambioDiagnostico[]>> {
    return this.http.get<GenericResponseDto<cambioDiagnostico[]>>(`${this.apiUrl}Api/v1/Diagnosticos`, {
      withCredentials: true,
    });
  }

  createDiagnostico(
    data: cambioDiagnostico
  ): Observable<GenericResponseDto<cambioDiagnostico>> {
    return this.http.post<GenericResponseDto<cambioDiagnostico>>(
      `${this.apiUrl}Api/v1/Diagnosticos`,
      data,
      {
        withCredentials: true,
      }
    );
  }

  deleteDiagnostico(
    diagnosticoId: number
  ): Observable<GenericResponseDto<cambioDiagnostico>> {
    return this.http.delete<GenericResponseDto<cambioDiagnostico>>(
      `${this.apiUrl}Api/v1/Diagnosticos/${diagnosticoId}`,
      {
        withCredentials: true,
      }
    );
  }

  updateDiagnostico(
    id: number,
    data: cambioDiagnostico
  ): Observable<GenericResponseDto<cambioDiagnostico>> {
    return this.http.put<GenericResponseDto<cambioDiagnostico>>(
      `${this.apiUrl}Api/v1/Diagnosticos/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
  }
}
