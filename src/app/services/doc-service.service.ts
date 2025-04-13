import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { cambioDiagnostico } from '../models/cambioDiagnostico';

@Injectable({
  providedIn: 'root'
})
export class DocServiceService {

  private baseUrl = 'http://localhost:8080/Api/document/generate';

  constructor(private http: HttpClient) {}

  generateDocument(data:cambioDiagnostico) {
    return this.http.post(this.baseUrl, data, {
      responseType: 'blob'  
    });
  }
}
