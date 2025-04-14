import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cambioDiagnostico } from '../models/cambioDiagnostico';

@Injectable({
  providedIn: 'root'
})
export class DbRegistrosService {

  private baseUrl = "http://localhost:8082/Api/v1/Diagnosticos";

  constructor(private http: HttpClient) { }

  createDiagnostico(data: cambioDiagnostico) {
    return this.http.post(this.baseUrl, data);
  }
}
