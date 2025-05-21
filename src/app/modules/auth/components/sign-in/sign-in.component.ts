import { Component, inject } from '@angular/core';

import { Form, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  router = inject(Router);
  authenticationService = inject(AuthenticationService);

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  handleSignIn() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authenticationService.login(username, password).subscribe({
      next: (user) => {
        if (user) {
          this.router.navigateByUrl('/dashboard/services');
        } else {
          console.error('Invalid username or password');
        }
      },
      error: (error) => {
        console.error('Error during login:', error);
      },
    });
  }
}
