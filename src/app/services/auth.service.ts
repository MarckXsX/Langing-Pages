import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../models/login-user';
import { NewUser } from '../models/new-user';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { GenericResponseDto } from '../models/GenericResponseDto';
import { cambioDiagnostico } from '../models/cambioDiagnostico';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) { }

  login(loginUser: LoginUser){
    return this.http.post(`${this.apiUrl}auth/login`, loginUser, {
      withCredentials: true,
    }
    );
  }

  register(newUser: NewUser){
    return this.http.post(`${this.apiUrl}auth/register`, newUser, {
      withCredentials: true,
    }
    );
  }

  logout(){
    return this.http.post(`${this.apiUrl}auth/logout`,null, {
      withCredentials: true,
    });
  }
}
