import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CourtsService } from '../../services/courts.service';
import { BookingsService } from '../../services/bookings.service';
import { Court, Booking } from '../../models/interfaces';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>🏟️ Panel de Administración</h1>
          <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        </div>
      </header>

      <div class="dashboard-content">
        <div class="tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'courts'"
            (click)="activeTab = 'courts'"
          >
            Gestión de Pistas
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'bookings'"
            (click)="activeTab = 'bookings'"
          >
            Reservas
          </button>
        </div>

        <!-- Gestión de Pistas -->
        <div *ngIf="activeTab === 'courts'" class="tab-content">
          <div class="section-header">
            <h2>Gestión de Pistas Deportivas</h2>
            <button (click)="showAddCourtForm = !showAddCourtForm" class="primary-btn">
              {{ showAddCourtForm ? 'Cancelar' : '+ Nueva Pista' }}
            </button>
          </div>

          <!-- Formulario Nueva Pista -->
          <div *ngIf="showAddCourtForm" class="form-card">
            <h3>{{ editingCourt ? 'Editar Pista' : 'Nueva Pista' }}</h3>
            <form (ngSubmit)="saveCourt()" class="court-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre</label>
                  <input [(ngModel)]="courtForm.name" name="name" required />
                </div>
                <div class="form-group">
                  <label>Tipo</label>
                  <select [(ngModel)]="courtForm.type" name="type" required>
                    <option value="">Seleccionar</option>
                    <option value="Tenis">Tenis</option>
                    <option value="Pádel">Pádel</option>
                    <option value="Fútbol">Fútbol</option>
                    <option value="Básquet">Básquet</option>
                    <option value="Squash">Squash</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Precio por Hora (€)</label>
                  <input type="number" [(ngModel)]="courtForm.pricePerHour" name="price" required />
                </div>
                <div class="form-group">
                  <label>Estado</label>
                  <select [(ngModel)]="courtForm.active" name="active">
                    <option [value]="true">Activa</option>
                    <option [value]="false">Inactiva</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <textarea [(ngModel)]="courtForm.description" name="description" rows="3"></textarea>
              </div>
              <div class="form-actions">
                <button type="button" (click)="cancelCourtForm()" class="secondary-btn">Cancelar</button>
                <button type="submit" class="primary-btn">
                  {{ editingCourt ? 'Actualizar' : 'Crear Pista' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Lista de Pistas -->
          <div class="courts-grid">
            <div *ngFor="let court of courts" class="court-card">
              <div class="court-header">
                <h3>{{ court.name }}</h3>
                <span class="court-status" [class.active]="court.active" [class.inactive]="!court.active">
                  {{ court.active ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
              <div class="court-details">
                <p><strong>Tipo:</strong> {{ court.type }}</p>
                <p><strong>Precio:</strong> {{ court.pricePerHour }}€/hora</p>
                <p><strong>Descripción:</strong> {{ court.description }}</p>
              </div>
              <div class="court-actions">
                <button (click)="editCourt(court)" class="edit-btn">Editar</button>
                <button (click)="deleteCourt(court.id)" class="delete-btn" 
                        onclick="return confirm('¿Estás seguro de eliminar esta pista?')">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Reservas -->
        <div *ngIf="activeTab === 'bookings'" class="tab-content">
          <div class="section-header">
            <h2>Gestión de Reservas</h2>
            <div class="stats">
              <div class="stat">
                <span class="stat-value">{{ confirmedBookings.length }}</span>
                <span class="stat-label">Confirmadas</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ cancelledBookings.length }}</span>
                <span class="stat-label">Canceladas</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ totalRevenue }}€</span>
                <span class="stat-label">Ingresos</span>
              </div>
            </div>
          </div>

          <div class="bookings-table">
            <div class="table-header">
              <div class="th">Fecha</div>
              <div class="th">Usuario</div>
              <div class="th">Pista</div>
              <div class="th">Hora</div>
              <div class="th">Precio</div>
              <div class="th">Estado</div>
              <div class="th">Acciones</div>
            </div>
            <div *ngFor="let booking of allBookings" class="table-row">
              <div class="td">{{ formatDate(booking.date) }}</div>
              <div class="td">{{ booking.userName }}</div>
              <div class="td">{{ booking.courtName }}</div>
              <div class="td">{{ booking.timeSlot }}</div>
              <div class="td">{{ booking.totalPrice }}€</div>
              <div class="td">
                <span class="status" [class]="booking.status">{{ booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada' }}</span>
              </div>
              <div class="td">
                <button *ngIf="booking.status === 'confirmed'" 
                        (click)="cancelBooking(booking.id)" 
                        class="cancel-btn">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      min-height: 100vh;
      background: #f8fafc;
    }

    .dashboard-header {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 1rem 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #1e293b;
      font-size: 1.5rem;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .logout-btn:hover {
      background: #dc2626;
    }

    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .tabs {
      display: flex;
      margin-bottom: 2rem;
      background: white;
      border-radius: 8px;
      padding: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .tab-btn {
      flex: 1;
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
      font-weight: 500;
    }

    .tab-btn.active {
      background: #2563eb;
      color: white;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      margin: 0;
      color: #1e293b;
    }

    .primary-btn {
      padding: 0.75rem 1.5rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .primary-btn:hover {
      background: #1d4ed8;
    }

    .secondary-btn {
      padding: 0.75rem 1.5rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .form-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .form-card h3 {
      margin: 0 0 1rem 0;
      color: #1e293b;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    .courts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .court-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .court-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .court-header h3 {
      margin: 0;
      color: #1e293b;
    }

    .court-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .court-status.active {
      background: #d1fae5;
      color: #065f46;
    }

    .court-status.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .court-details p {
      margin: 0.5rem 0;
      color: #4b5563;
    }

    .court-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .edit-btn {
      padding: 0.5rem 1rem;
      background: #f59e0b;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .delete-btn {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .stats {
      display: flex;
      gap: 2rem;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: #2563eb;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .bookings-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }

    .table-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      align-items: center;
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status.confirmed {
      background: #d1fae5;
      color: #065f46;
    }

    .status.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    .cancel-btn {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .courts-grid {
        grid-template-columns: 1fr;
      }

      .stats {
        justify-content: space-around;
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .th,
      .td {
        padding: 0.5rem 0;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'courts';
  showAddCourtForm = false;
  editingCourt: Court | null = null;
  
  courts: Court[] = [];
  allBookings: Booking[] = [];
  
  courtForm = {
    name: '',
    type: '',
    pricePerHour: 0,
    description: '',
    active: true
  };

  constructor(
    private authService: AuthService,
    private courtsService: CourtsService,
    private bookingsService: BookingsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.courtsService.courts$.subscribe(courts => {
      this.courts = courts;
    });

    this.bookingsService.bookings$.subscribe(bookings => {
      this.allBookings = bookings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  get confirmedBookings(): Booking[] {
    return this.allBookings.filter(b => b.status === 'confirmed');
  }

  get cancelledBookings(): Booking[] {
    return this.allBookings.filter(b => b.status === 'cancelled');
  }

  get totalRevenue(): number {
    return this.confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  }

  saveCourt(): void {
    if (this.editingCourt) {
      this.courtsService.updateCourt(this.editingCourt.id, this.courtForm);
    } else {
      this.courtsService.addCourt(this.courtForm);
    }
    this.cancelCourtForm();
  }

  editCourt(court: Court): void {
    this.editingCourt = court;
    this.courtForm = {
      name: court.name,
      type: court.type,
      pricePerHour: court.pricePerHour,
      description: court.description,
      active: court.active
    };
    this.showAddCourtForm = true;
  }

  deleteCourt(courtId: string): void {
    this.courtsService.deleteCourt(courtId);
  }

  cancelCourtForm(): void {
    this.showAddCourtForm = false;
    this.editingCourt = null;
    this.courtForm = {
      name: '',
      type: '',
      pricePerHour: 0,
      description: '',
      active: true
    };
  }

  cancelBooking(bookingId: string): void {
    this.bookingsService.cancelBooking(bookingId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  logout(): void {
    this.authService.logout();
  }
}