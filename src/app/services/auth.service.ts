import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../models/interfaces';
import { environment } from '../enviroments/enviroment/enviroment';
import { UserRole } from '../models/user-roles.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly supabase: SupabaseClient;
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadUserFromSession();

    // 🔄 Escucha cambios de sesión
    this.supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.setCurrentUser(session.user);
      } else {
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
      }
    });
  }

  /** Guarda usuario en memoria y localStorage */
  private setCurrentUser(supabaseUser: SupabaseUser) {
    const user: User = {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name: supabaseUser.user_metadata?.['full_name'] ?? '',
      role: UserRole.CLIENT // 🔹 por defecto si no se conoce
    };
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /** Cargar usuario almacenado en la sesión previa */
  private loadUserFromSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  /** Cierra sesión y limpia todo */
  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    await this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Obtiene perfil con rol */
  private async fetchUserProfile(userId: string) {
    const { data: perfil, error } = await this.supabase
      .from('perfiles')
      .select('rol')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching perfil:', error);
      return null;
    }
    return perfil;
  }

  /** Maneja login común entre email/Google */
  private async handleUserLogin(supabaseUser: SupabaseUser): Promise<User> {
    this.setCurrentUser(supabaseUser);

    let perfil = await this.fetchUserProfile(supabaseUser.id);
    if (!perfil) {
      // 🔹 Crear perfil si no existe
      const fullName = supabaseUser.user_metadata?.['full_name'] ?? '';
      const [nombre, ...apellidosParts] = fullName.trim().split(/\s+/);
      const apellidos = apellidosParts.join(' ').trim();
      try {
        await this.supabase.from('perfiles').insert({
          identificacion: supabaseUser.id,
          nombre,
          apellidos,
          rol: UserRole.CLIENT
        });
        perfil = await this.fetchUserProfile(supabaseUser.id);
      } catch (e) {
        console.error('Error creando perfil tras login:', e);
      }
    }

    const role = (perfil?.rol as UserRole) ?? UserRole.CLIENT;

    const userWithRole: User = {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name: supabaseUser.user_metadata?.['full_name'] ?? '',
      role,
    };

    this.currentUserSubject.next(userWithRole);
    localStorage.setItem('currentUser', JSON.stringify(userWithRole));

    // 🔄 redirección según rol
    if (userWithRole.role === UserRole.ADMIN) {
      await this.router.navigate(['/admin']);
    } else {
      await this.router.navigate(['/user']);
    }

    return userWithRole;
  }

  /** Login normal con email y contraseña */
  async loginWithRole(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      console.error('Error en login:', error?.message);
      return null;
    }
    return await this.handleUserLogin(data.user);
  }

  /** Verifica si el usuario actual es ADMIN */
  async isAdmin(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true;

    const perfil = await this.fetchUserProfile(user.id);
    return perfil?.rol?.toUpperCase() === UserRole.ADMIN;
  }

  /** Registro de usuario con email/contraseña */
  async signUp(fullName: string, email: string, password: string): Promise<{ user: User | null; needsConfirmation: boolean; uid: string | null }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      console.error('Error en registro:', error.message);
      throw error;
    }

    const uid: string | null = data.user?.id ?? null;

    if (data.user) {
      const needsConfirmation = !data.session;
      let user: User | null = null;

      if (data.session) {
        user = await this.handleUserLogin(data.user);
      }

      return { user, needsConfirmation, uid };
    }

    return { user: null, needsConfirmation: true, uid: null };
  }

  /** Verifica si hay sesión activa */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /** Login con Google */
  async loginWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    });

    if (error) {
      console.error('Error en login con Google:', error.message);
      throw error;
    }
    return data;
  }

  /** Callback después de login con Google */
  async handleGoogleCallback(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error || !data.session?.user) {
      console.error('Error obteniendo sesión de Google:', error?.message);
      return null;
    }
    return await this.handleUserLogin(data.session.user);
  }
}
