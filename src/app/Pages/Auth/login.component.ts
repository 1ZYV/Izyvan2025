import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/Auth/auth.service';

@Component({
    selector: 'pg-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: true,
    imports: [FormsModule]
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        if (!this.email || !this.password) {
            this.errorMessage = 'Por favor, completa todos los campos';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        // Simular login
        this.authService.login({ email: this.email, password: this.password })
            .subscribe({
                next: (user) => {
                    console.log('Login exitoso:', user);
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    console.error('Error en login:', error);
                    this.errorMessage = 'Credenciales inválidas';
                    this.isLoading = false;
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
    }

    // Método para login con credenciales de prueba
    loginAsDemo(): void {
        this.email = 'admin@admin.com';
        this.password = '123456';
        this.onSubmit();
    }
}
