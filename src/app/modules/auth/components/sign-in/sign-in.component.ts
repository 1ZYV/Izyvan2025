import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  router = inject(Router);

  public handleSignIn() {
    // Logic to handle sign-in, e.g., form submission, validation, etc.
    console.log('Sign-in button clicked!');
    this.router.navigate(['dashboard']); // Navigate to dashboard after sign-in
  }
}
