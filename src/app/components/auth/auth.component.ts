import { Component } from '@angular/core';
import { Form, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, ReactiveFormsModule, RouterModule, ButtonModule, InputTextModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.toastService.showToast('Exito','Bienvenido','success');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.toastService.showToast('Error',error.error.message,'error');
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

}
