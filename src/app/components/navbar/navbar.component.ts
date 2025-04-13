import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [Menubar, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor(private router: Router) {

  }


  ngOnInit(): void {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        //funcion callback para redireccionar a la ruta principal
        command: () => {
          this.router.navigate(['']);
        }
      },
      {
        label: 'Registros',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Cambio Diagnóstico',
            route: '/cambio-diagnostico'
          }
        ]
      },
      {
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
      }
    ];
  }

}
