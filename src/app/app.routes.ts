import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { RegisterComponent } from './components/register/register.component';
import {AuthCallbackComponent} from "./components/auth/auth-callback.component";
import { RegisterChoiceComponent } from './components/register-choice/register-choice.component';
import { RegisterEmpresaComponent } from './components/register-empresa/register-empresa.component';
import {CourtsComponent} from "./components/courts/courts.component";

 
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'courts', component: CourtsComponent },

  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'register', component: RegisterChoiceComponent },
  { path: 'register/usuario', component: RegisterComponent },
  { path: 'register/empresa', component: RegisterEmpresaComponent },

  {
    path: 'user',
    component: UserDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', redirectTo: 'login' },
];
