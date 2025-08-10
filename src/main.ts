import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { User } from './models/interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, AdminDashboardComponent, UserDashboardComponent],
  template: `
    <div class="app-container">
      <!-- Login Screen -->
      <app-login *ngIf="!currentUser"></app-login>
      
      <!-- Admin Dashboard -->
      <app-admin-dashboard *ngIf="currentUser && currentUser.role === 'admin'"></app-admin-dashboard>
      
      <!-- User Dashboard -->
      <app-user-dashboard *ngIf="currentUser && currentUser.role === 'user'"></app-user-dashboard>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
    }
  `]
})
export class App implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}

bootstrapApplication(App);