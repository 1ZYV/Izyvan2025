import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './Services/Auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mvp-frontend';
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  constructor() {
    // Solo verificar el estado de autenticación, sin hacer redirects automáticos
    this.checkAuthState();
  }

  private checkAuthState(): void {
    // Verificar que estamos en el navegador antes de acceder a localStorage
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // El AuthService ahora maneja automáticamente la restauración de sesión
    const token = this.authService.getToken();
    console.log('AppComponent: Token encontrado:', !!token);

    // No hacer redirects aquí, dejar que las rutas y guards manejen la navegación
  }
}
