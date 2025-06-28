import { Component, OnInit } from '@angular/core';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { StatusUser } from '../../models/statusUser';


@Component({
  selector: 'app-data-usuarios',
  imports: [NavbarAdminComponent, ButtonModule,TableModule, RippleModule],
  templateUrl: './data-usuarios.component.html',
  styleUrl: './data-usuarios.component.css'
})
export class DataUsuariosComponent implements OnInit{

  Usuarios!: User[]; 
  StatusUser = StatusUser;

  constructor(private readonly userService: UserService, private readonly toastService: ToastService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.userService.getUsersDetails().subscribe({
      next: (response) => {
        this.Usuarios = Array.isArray(response.data) ? response.data : [response.data];
      },
      error: (error) => {
        this.toastService.showToast('Error','Error al cargar los usuarios','error');
      }
    });
  }

  updateUser(userId: number, status: StatusUser) {
    this.userService.updateStatusUser(userId, status).subscribe({
      next: (response) => {
        this.toastService.showToast('Exito','Se actualizo el estatus del Usuario','success');
        this.loadUsuarios(); // Recarga la lista después de eliminar
      },
      error: (error) => {
        //this.toast.showError('Error al eliminar el usuario');
        console.log(error);
        this.toastService.showToast('Error','Error al actualizar el usuario','error');
      }
    });
  }
  
}
