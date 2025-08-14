import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🏟️ SportCourt</h1>
          <p>Crea tu cuenta</p>
        </div>

        <form (ngSubmit)="register()" class="login-form">
          <div class="form-group">
            <label for="name">Nombre completo</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="name"
              name="name"
              placeholder="Tu nombre"
              required
            />
          </div>

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

          <div class="form-group">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="login-btn" [disabled]="!name || !email || !password || !confirmPassword || loading">
            Crear cuenta
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="signup-hint">
            ¿Ya tienes cuenta?
            <a [routerLink]="['/login']" class="signup-link">Inicia sesión</a>
          </div>
        </form>
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
      margin-bottom: 1.25rem;
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

    .success-message {
      color: #10b981;
      text-align: center;
      margin-top: 0.75rem;
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
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async register(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const name = this.name.trim();
    const email = this.email.trim().toLowerCase();
    const password = this.password;

    if (!name || !email || !password || !this.confirmPassword) {
      this.errorMessage = 'Completa todos los campos';
      return;
    }

    if (password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    try {
      const result = await this.authService.signUp(name, email, password);
      if (result.needsConfirmation) {
        this.successMessage = 'Registro exitoso. Revisa tu correo para confirmar tu cuenta.';
      } else if (result.user) {
        await this.router.navigate(['/user']);
      }
    } catch (e: any) {
      console.error(e);
      this.errorMessage = e?.message ?? 'No se pudo completar el registro. Intenta nuevamente.';
    } finally {
      this.loading = false;
    }
  }
}
