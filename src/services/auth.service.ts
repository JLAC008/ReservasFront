import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [
    { id: '1', email: 'admin@deportes.com', name: 'Administrador', role: 'admin' },
    { id: '2', email: 'usuario@email.com', name: 'Juan Pérez', role: 'user' },
    { id: '3', email: 'maria@email.com', name: 'María García', role: 'user' }
  ];

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): boolean {
    // Simulación de login - en producción esto sería una llamada API
    const user = this.users.find(u => u.email === email);
    if (user && password === '123456') {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}