import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🏟️ SportCourt</h1>
          <p>Registro de Empresa</p>
        </div>

        <form class="login-form" (ngSubmit)="$event.preventDefault()">
          <div class="form-group">
            <label for="companyName">Nombre de la empresa</label>
            <input id="companyName" name="companyName" type="text" placeholder="Tu empresa S.L." required />
          </div>

          <div class="form-group">
            <label for="email">Email de contacto</label>
            <input id="email" name="email" type="email" placeholder="empresa@email.com" required />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" class="login-btn" disabled>
            Crear cuenta de empresa (Próximamente)
          </button>

          <div class="signup-hint">
            ¿Eres un usuario particular?
            <a [routerLink]="['/register/usuario']" class="signup-link">Regístrate como usuario</a>
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
      cursor: not-allowed;
      opacity: 0.7;
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
export class RegisterEmpresaComponent {}
