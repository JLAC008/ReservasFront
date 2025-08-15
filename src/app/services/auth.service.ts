import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {createClient, SupabaseClient, User as SupabaseUser} from '@supabase/supabase-js';
import {User} from '../models/interfaces';
import {environment} from '../enviroments/enviroment/enviroment';
import {UserRole} from "../models/user-roles.enum";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabase: SupabaseClient;
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private readonly router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadUserFromSession();

    this.supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.setCurrentUser(session.user);
      } else {
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
      }
    });
  }

  private setCurrentUser(supabaseUser: SupabaseUser) {
    const user: User = {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name: supabaseUser.user_metadata?.['full_name'] ?? '',
      role: 'user'
    };
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }



  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    await this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

private async fetchUserProfile(userId: string) {
  const { data: perfil, error } = await this.supabase
    .from('perfiles')
    .select('rol')
    .eq('identificacion', userId)
    .single();
  if (error) {
    console.error('Error fetching perfil:', error);
    return null;
  }
  return perfil;
}

async loginWithRole(email: string, password: string): Promise<User | null> {
  const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    console.error('Error en login:', error?.message);
    return null;
  }

  this.setCurrentUser(data.user);

  let perfil = await this.fetchUserProfile(data.user.id);
  if (!perfil) {
    // Crear perfil por primera vez tras login (ahora sí hay sesión y RLS lo permite)
    const fullName = data.user.user_metadata?.['full_name'] ?? '';
    const [nombre, ...apellidosParts] = fullName.trim().split(/\s+/);
    const apellidos = apellidosParts.join(' ').trim();
    try {
      await this.supabase.from('perfiles').insert({
        identificacion: data.user.id,
        nombre,
        apellidos,
        rol: 'CLIENTE'
      });
      perfil = await this.fetchUserProfile(data.user.id);
    } catch (e) {
      console.error('Error creando perfil tras login:', e);
    }
  }
  const role = perfil?.rol ?? 'user';

  const userWithRole: User = {
    id: data.user.id,
    email: data.user.email ?? '',
    name: data.user.user_metadata?.['full_name'] ?? '',
    role,
  };

  this.currentUserSubject.next(userWithRole);
  localStorage.setItem('currentUser', JSON.stringify(userWithRole));

  if (userWithRole.role.toUpperCase() === UserRole.ADMIN) {
    await this.router.navigate(['/admin']);
  } else {
    await this.router.navigate(['/user']);
  }

  return userWithRole;
}

async isAdmin(): Promise<boolean> {
  const user = this.getCurrentUser();
  if (!user) return false;

  // Si ya tienes el rol en el usuario, lo puedes usar directamente sin hacer consulta
  if (user.role.toUpperCase() === UserRole.ADMIN) {
    return true;
  }

  // Si quieres asegurarte que el rol está actualizado, haz consulta:
  const perfil = await this.fetchUserProfile(user.id);
  return perfil?.rol.toUpperCase() === UserRole.ADMIN;
}

async signUp(fullName: string, email: string, password: string): Promise<{ user: User | null; needsConfirmation: boolean; uid: string | null }> {
  const { data, error } = await this.supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
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
      this.setCurrentUser(data.user);
      const userWithRole: User = {
        id: data.user.id,
        email: data.user.email ?? '',
        name: data.user.user_metadata?.['full_name'] ?? fullName,
        role: 'user',
      };
      this.currentUserSubject.next(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
      user = userWithRole;
    }

    return { user, needsConfirmation, uid };
  }

  return { user: null, needsConfirmation: true, uid: null };
}

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
