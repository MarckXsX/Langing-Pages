import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { cambioDiagnostico } from '../models/cambioDiagnostico';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DocServiceService {
  
  private apiUrl = environment.apiUrlDoc;

  constructor(private http: HttpClient) {}

  generateDocument(data:cambioDiagnostico): Observable<Blob> {
    return this.http.post(`${this.apiUrl}Api/document/generate`, data, {
      responseType: 'blob'  
    });
  }
}
