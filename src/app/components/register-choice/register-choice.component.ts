import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-choice',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🏟️ SportCourt</h1>
          <p>Elige el tipo de cuenta</p>
        </div>

        <div class="choice-container">
          <button class="choice-btn user" [routerLink]="['/register/usuario']">
            👤 Soy Usuario
          </button>
          <button class="choice-btn company" [routerLink]="['/register/empresa']">
            🏢 Soy Empresa
          </button>

          <div class="signup-hint">
            ¿Ya tienes cuenta?
            <a [routerLink]="['/login']" class="signup-link">Inicia sesión</a>
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

    .choice-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .choice-btn {
      width: 100%;
      padding: 0.85rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.05s ease, box-shadow 0.2s ease, background 0.2s ease;
      color: white;
    }

    .choice-btn.user {
      background: #2563eb;
    }

    .choice-btn.user:hover {
      background: #1d4ed8;
    }

    .choice-btn.company {
      background: #059669;
    }

    .choice-btn.company:hover {
      background: #047857;
    }

    .choice-btn:active {
      transform: translateY(1px);
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
export class RegisterChoiceComponent {}
