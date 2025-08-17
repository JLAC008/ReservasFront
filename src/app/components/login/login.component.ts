import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🏟️ SportCourt</h1>
          <p>Sistema de Reservas Deportivas</p>
        </div>

        <form (ngSubmit)="login()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="login-btn" [disabled]="!email || !password">
            Iniciar Sesión
          </button>

          <button type="button" class="google-btn" (click)="loginWithGoogle()">
            <img src="assets/google-icon-logo.webp" alt="Google" class="google-icon"/>
            <span>Continuar con Google</span>
          </button>

          <div class="signup-hint">
            ¿No tienes cuenta?
            <a [routerLink]="['/register']" class="signup-link">Regístrate</a>
          </div>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>

        <div class="demo-accounts">
          <h3>Cuentas de Prueba:</h3>
          <div class="demo-account">
            <strong>Administrador:</strong><br>
            Email: walacapps&#64;gmail.com<br>
            Contraseña: WalacMasoki13.
          </div>
          <div class="demo-account">
            <strong>Usuario:</strong><br>
            Email: alejandrofmayor98&#64;gmail.com<br>
            Contraseña: Geoymunicipal123
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      font-size: 2rem;
      margin: 0;
      color: #1f2937;
      font-weight: 700;
    }

    .login-header p {
      color: #6b7280;
      margin: 0.5rem 0 0 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .login-btn {
      width: 100%;
      padding: 0.75rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-bottom: 0.75rem;
    }

    .login-btn:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .login-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-message {
      color: #ef4444;
      text-align: center;
      margin-top: 1rem;
      font-size: 0.875rem;
    }

    .signup-hint {
      text-align: center;
      margin-top: 0.75rem;
      font-size: 0.875rem;
      color: #374151;
    }

    .signup-hint .signup-link {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
    }

    .signup-hint .signup-link:hover {
      text-decoration: underline;
    }

    .demo-accounts {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .demo-accounts h3 {
      margin: 0 0 1rem 0;
      color: #1f2937;
      font-size: 1rem;
    }

    .demo-account {
      background: #f9fafb;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 0.75rem;
      font-size: 0.75rem;
      line-height: 1.4;
    }

    .google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid #d1d5db; /* gris claro */
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #111827; /* texto gris oscuro */
  cursor: pointer;
  width: 100%;
  max-width: 320px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.google-btn:hover {
  background-color: #f9fafb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.google-btn:active {
  background-color: #f3f4f6;
}

.google-icon {
  width: 18px;
  height: 18px;
}


  `]
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.errorMessage = '';
  }

  async login(): Promise<void> {
    this.errorMessage = '';
    try {
      const user = await this.authService.loginWithRole(this.email, this.password);
      if (!user) {
        this.errorMessage = 'Email o contraseña incorrectos';
      }
      // 🔄 la redirección la maneja el AuthService
    } catch (error) {
      this.errorMessage = 'Error inesperado, intenta nuevamente';
      console.error(error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
      // el callback redirigirá tras login con Google
    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión con Google';
      console.error(error);
    }
  }
}
