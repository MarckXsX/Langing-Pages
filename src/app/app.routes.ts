import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CambioDiagnosticoComponent } from './components/cambio-diagnostico/cambio-diagnostico.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'cambio-diagnostico',
        component: CambioDiagnosticoComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
