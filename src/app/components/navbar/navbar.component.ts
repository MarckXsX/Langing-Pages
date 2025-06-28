import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, CommonModule, RouterLink, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor(
    private router: Router, 
    private readonly authService: AuthService,
    private readonly toastService: ToastService) {
  }


  ngOnInit(): void {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        //funcion callback para redireccionar a la ruta principal
        command: () => {
          this.router.navigate(['/home']);
        }
      },
      {
        label: 'Registros',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Cambio Diagnóstico',
            route: '/cambio-diagnostico'
          },
          {
            label: 'Historial de Diagnósticos',
            route: '/diagnosticos-usuarios'
          }
        ]
      }
      /*{
        label: 'Opcion 1',
        icon: 'pi pi-home',
        items: [
          {
            label: 'Angular',
            url: 'https://angular.io/'
          },
          {
            label: 'Vite.js',
            url: 'https://vitejs.dev/'
          }
        ]
      }*/
    ];
  }

  logout(){
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful', response);
        this.toastService.showToast('Exito','Sesion Cerrada','success');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout failed', error);
        this.toastService.showToast('Error',error.error.message,'error');
      }
    });
  }

}
