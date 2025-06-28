import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CambioDiagnosticoComponent } from './components/cambio-diagnostico/cambio-diagnostico.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthComponent } from './components/auth/auth.component';
import { myGuardGuard } from './guardas/my-guard.guard';

export const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        pathMatch: 'full',
        title: 'Login'
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
        title: 'Registro'
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
        title: 'Inicio',
        canActivate: [myGuardGuard],
        data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] }
    },
    {
        path: 'cambio-diagnostico',
        loadComponent: () => import('./components/cambio-diagnostico/cambio-diagnostico.component').then(m=>m.CambioDiagnosticoComponent),
        canActivate: [myGuardGuard],
        data: { roles: ['ROLE_USER'] }
    },
    {
        path: 'data-usuarios',
        loadComponent: () => import('./components/data-usuarios/data-usuarios.component').then(m => m.DataUsuariosComponent),
        canActivate: [myGuardGuard],
        data: { roles: ['ROLE_ADMIN'] }
    },
    {
        path: 'diagnosticos-usuarios',
        loadComponent: () => import('./components/diagnosticos-usuarios/diagnosticos-usuarios.component').then(m => m.DiagnosticosUsuariosComponent),
        canActivate: [myGuardGuard],
        data: { roles: ['ROLE_USER'] }
    },
    {
        path: 'diagnosticos',
        loadComponent: () => import('./components/diagnosticos/diagnosticos.component').then(m => m.DiagnosticosComponent),
        canActivate: [myGuardGuard],
        data: { roles: ['ROLE_ADMIN'] }
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
