import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const myInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 403) {
        toastService
          .showToast('Error', 'No autorizado', 'error');
          router.navigateByUrl('');
      }
      return throwError(() => error)
    })
  );
};
