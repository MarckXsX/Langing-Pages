import { Component } from '@angular/core';
import { User } from '../../models/user';
import {NavbarComponent} from '../navbar/navbar.component';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, NavbarAdminComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  user: User | undefined

  constructor(private readonly userService: UserService) {}

  ngOnInit() {
    this.userService.getDetails().subscribe({
      next: (response) => {
        this.user = response.data;
        console.log('detalles del usuario autenticado', this.user);
      },
      error: (error) => {
        console.error('Error fetching user details', error);
      }
    });
  }

}
