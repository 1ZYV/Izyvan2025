import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { Form, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    username: new FormGroup(''),
    password: new FormGroup(''),
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
