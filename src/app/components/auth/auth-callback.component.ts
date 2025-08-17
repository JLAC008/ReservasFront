import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div class="callback-container">
      <div class="loading-spinner"></div>
      <p>Procesando inicio de sesión...</p>
    </div>
  `,
  styles: [`
    .callback-container {
      text-align: center;
      margin-top: 50px;
      font-size: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class AuthCallbackComponent implements OnInit {

  constructor(private readonly authService: AuthService) {}

  async ngOnInit() {
    try {
      await this.authService.handleGoogleCallback();
      // El redireccionamiento según rol se hace dentro de handleUserLogin
    } catch (error) {
      console.error('Error procesando callback de Google:', error);
      // Si hay error podrías mandar al login
    }
  }
}