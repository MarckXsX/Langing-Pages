import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, catchError, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';

export const myGuardGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state
): Observable<boolean | UrlTree> => {
  const userService = inject(UserService);
  const router = inject(Router);
   const allowedRoles = route.data['roles'] as string[]; // Lee los roles permitidos de la ruta

  return userService.getDetails().pipe(
    take(1),
    map(response => {
      const roleName = response.data.role.name;
      // Verifica si el rol del usuario está en los roles permitidos
      if (allowedRoles && allowedRoles.includes(roleName)) {
        return true;
      }
      // Si no está permitido, redirige
      console.log(`Access denied for role: ${roleName}. Redirecting...`);
      return router.createUrlTree(['/']);
    }),
    catchError(() => {
      console.log('Error fetching user details. Redirecting to home.');
      return of(router.createUrlTree(['/']));
    })
  );
};