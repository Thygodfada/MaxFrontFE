import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  model: LoginRequest;

  constructor(private authservice: AuthService, private router: Router){
    this.model ={
      email: '',
      password: ''
    };
  }

  onFormSubmit(): void{
    this.authservice.login(this.model)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/dashboard']);
        }

      });
  }
}
