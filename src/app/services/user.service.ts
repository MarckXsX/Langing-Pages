import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponseDto } from '../models/GenericResponseDto';
import { User } from '../models/user';
import { StatusUser } from '../models/statusUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) { }

  getDetails(): Observable<GenericResponseDto<User>> {
    return this.http.get<GenericResponseDto<User>>(`${this.apiUrl}user/details`, {
      withCredentials: true,
    });
  }

  getUsersDetails(): Observable<GenericResponseDto<User>> {
    return this.http.get<GenericResponseDto<User>>(`${this.apiUrl}user/allDetails`, {
      withCredentials: true,
    });
  }

  deleteUser(userId: number): Observable<GenericResponseDto<User>> {
    return this.http.delete<GenericResponseDto<User>>(`${this.apiUrl}user/delete/${userId}`, {
      withCredentials: true,
    });
  }

  updateStatusUser(userId: number, status: String): Observable<GenericResponseDto<User>> {
    return this.http.put<GenericResponseDto<User>>(`${this.apiUrl}user/${userId}`, status, {
      withCredentials: true,
    });
  }
}
