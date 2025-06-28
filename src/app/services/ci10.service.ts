import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cie10 } from '../models/ci10';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Ci10Service {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCie10ByCode(code: string): Observable<cie10[]> {
    return this.http.get<cie10[]>(`${this.apiUrl}Api/v1/Cie10/codigo?query=${code}`, {
      withCredentials: true,
    });
  }
}
