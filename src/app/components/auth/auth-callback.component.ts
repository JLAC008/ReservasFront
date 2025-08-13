import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div class="callback-container">
      <p>Procesando inicio de sesión...</p>
    </div>
  `,
  styles: [`
    .callback-container {
      text-align: center;
      margin-top: 50px;
      font-size: 18px;
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
