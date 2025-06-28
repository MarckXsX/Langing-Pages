import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-admin',
  imports: [Menubar, CommonModule, RouterLink, ButtonModule],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent implements OnInit {

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
        label: 'Usuarios',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Datos Usuario',
            route: '/data-usuarios'
          }
        ]
      },
      {
        label: 'Diagnosticos',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Diagnosticos Usuarios',
            route: '/diagnosticos'
          }
        ]
      }
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
