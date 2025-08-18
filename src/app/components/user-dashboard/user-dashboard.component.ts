import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BookingsService } from '../../services/bookings.service';
import { Court, Booking, User, DaySchedule } from '../../models/interfaces';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>🏟️ SportCourt - Reservas</h1>
          <div class="user-info">
            <span>Bienvenido, {{ currentUser?.name }}</span>
            <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <div class="dashboard-content">
        <div class="tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'booking'"
            (click)="activeTab = 'booking'"
          >
            Nueva Reserva
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'my-bookings'"
            (click)="activeTab = 'my-bookings'"
          >
            Mis Reservas
          </button>
        </div>

        <!-- Nueva Reserva -->
        <div *ngIf="activeTab === 'booking'" class="tab-content">
          <div class="booking-section">
            <h2>Realizar Nueva Reserva</h2>
            
            <div class="booking-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Seleccionar Pista</label>
                  <select [(ngModel)]="selectedCourtId" (ngModelChange)="loadSchedule()">
                    <option value="">Selecciona una pista</option>
                    <option *ngFor="let court of activeCourts" [value]="court.id">
                      {{ court.name }} - {{ court.type }} ({{ court.pricePerHour }}€/h)
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Fecha</label>
                  <input 
                    type="date" 
                    [(ngModel)]="selectedDate" 
                    [min]="minDate"
                    (ngModelChange)="loadSchedule()"
                  />
                </div>
              </div>
            </div>

            <!-- Horarios Disponibles -->
            <div *ngIf="selectedCourtId && selectedDate" class="schedule-section">
              <h3>Horarios para {{ formatDate(selectedDate) }}</h3>
              <div class="schedule-grid">
                <div 
                  *ngFor="let slot of daySchedule?.timeSlots" 
                  class="time-slot"
                  [class.available]="slot.available"
                  [class.occupied]="!slot.available"
                  [class.selected]="selectedTimeSlot === slot.hour"
                  (click)="selectTimeSlot(slot)"
                >
                  <div class="time">{{ slot.hour }}</div>
                  <div class="status">
                    <span *ngIf="slot.available" class="available-text">Disponible</span>
                    <span *ngIf="!slot.available" class="occupied-text">
                      Reservado por {{ slot.bookedBy }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Confirmación de Reserva -->
              <div *ngIf="selectedTimeSlot" class="booking-confirmation">
                <div class="booking-summary">
                  <h4>Resumen de la Reserva</h4>
                  <div class="summary-details">
                    <p><strong>Pista:</strong> {{ getSelectedCourt()?.name }}</p>
                    <p><strong>Fecha:</strong> {{ formatDate(selectedDate) }}</p>
                    <p><strong>Hora:</strong> {{ selectedTimeSlot }}</p>
                    <p><strong>Duración:</strong> 1 hora</p>
                    <p><strong>Precio:</strong> {{ getSelectedCourt()?.pricePerHour }}€</p>
                  </div>
                  <button (click)="confirmBooking()" class="confirm-btn">
                    Confirmar Reserva
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mis Reservas -->
        <div *ngIf="activeTab === 'my-bookings'" class="tab-content">
          <div class="my-bookings-section">
            <h2>Mis Reservas</h2>
            
            <div *ngIf="userBookings.length === 0" class="no-bookings">
              <p>No tienes reservas activas.</p>
            </div>

            <div *ngIf="userBookings.length > 0" class="bookings-list">
              <div *ngFor="let booking of userBookings" class="booking-card">
                <div class="booking-header">
                  <h3>{{ booking.courtName }}</h3>
                  <span class="status" [class]="booking.status">
                    {{ booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada' }}
                  </span>
                </div>
                <div class="booking-details">
                  <p><strong>Fecha:</strong> {{ formatDate(booking.date) }}</p>
                  <p><strong>Hora:</strong> {{ booking.timeSlot }}</p>
                  <p><strong>Duración:</strong> {{ booking.duration }} hora</p>
                  <p><strong>Precio:</strong> {{ booking.totalPrice }}€</p>
                  <p><strong>Estado:</strong> {{ booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada' }}</p>
                </div>
                <div *ngIf="booking.status === 'confirmed'" class="booking-actions">
                  <button 
                    (click)="cancelBooking(booking.id)" 
                    class="cancel-btn"
                    onclick="return confirm('¿Estás seguro de cancelar esta reserva?')"
                  >
                    Cancelar Reserva
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .dashboard-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
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
      font-weight: 700;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-weight: 500;
      color: #374151;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }

    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .tabs {
      display: flex;
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 6px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    .tab-btn {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s;
      font-weight: 600;
      color: #64748b;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .booking-section,
    .my-bookings-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    .booking-section h2,
    .my-bookings-section h2 {
      margin: 0 0 2rem 0;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 600;
    }

    .form-group select,
    .form-group input {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      box-sizing: border-box;
    }

    .form-group select:focus,
    .form-group input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .schedule-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #f1f5f9;
    }

    .schedule-section h3 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .schedule-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .time-slot {
      padding: 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;
      text-align: center;
    }

    .time-slot.available {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .time-slot.available:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
    }

    .time-slot.occupied {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      cursor: not-allowed;
      opacity: 0.8;
    }

    .time-slot.selected {
      border-color: #fbbf24;
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);
    }

    .time {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .status {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .booking-confirmation {
      margin-top: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border-radius: 12px;
      border: 2px solid #0ea5e9;
    }

    .booking-summary h4 {
      margin: 0 0 1rem 0;
      color: #0c4a6e;
      font-size: 1.25rem;
    }

    .summary-details p {
      margin: 0.5rem 0;
      color: #0f172a;
    }

    .confirm-btn {
      margin-top: 1.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .confirm-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
    }

    .no-bookings {
      text-align: center;
      padding: 3rem;
      color: #64748b;
    }

    .bookings-list {
      display: grid;
      gap: 1.5rem;
    }

    .booking-card {
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s;
    }

    .booking-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .booking-header h3 {
      margin: 0;
      color: #1e293b;
      font-size: 1.125rem;
    }

    .status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
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

    .booking-details p {
      margin: 0.5rem 0;
      color: #475569;
    }

    .booking-actions {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .cancel-btn {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .cancel-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .schedule-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .user-info {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  activeTab = 'booking';
  currentUser: User | null = null;
  activeCourts: Court[] = [];
  userBookings: Booking[] = [];
  
  selectedCourtId = '';
  selectedDate = '';
  selectedTimeSlot = '';
  daySchedule: DaySchedule | null = null;
  minDate = '';

  constructor(
    private authService: AuthService,
    private bookingsService: BookingsService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.selectedDate = this.minDate;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserBookings();
      }
    });


    this.bookingsService.bookings$.subscribe(() => {
      if (this.currentUser) {
        this.loadUserBookings();
      }
      if (this.selectedCourtId && this.selectedDate) {
        this.loadSchedule();
      }
    });
  }

  loadUserBookings(): void {
    if (this.currentUser) {
      this.userBookings = this.bookingsService.getUserBookings(this.currentUser.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  loadSchedule(): void {
    if (this.selectedCourtId && this.selectedDate) {
      this.daySchedule = this.bookingsService.getCourtSchedule(this.selectedCourtId, this.selectedDate);
      this.selectedTimeSlot = '';
    }
  }

  selectTimeSlot(slot: any): void {
    if (slot.available) {
      this.selectedTimeSlot = slot.hour;
    }
  }

  getSelectedCourt(): Court | undefined {
    return this.activeCourts.find(court => court.id === this.selectedCourtId);
  }

  confirmBooking(): void {
    if (!this.currentUser || !this.selectedCourtId || !this.selectedDate || !this.selectedTimeSlot) {
      return;
    }

    const court = this.getSelectedCourt();
    if (!court) return;

    const booking = {
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userEmail: this.currentUser.email,
      courtId: court.id,
      courtName: court.name,
      date: this.selectedDate,
      timeSlot: this.selectedTimeSlot,
      duration: 1,
      totalPrice: court.pricePerHour,
      status: 'confirmed' as const
    };

    this.bookingsService.createBooking(booking);
    
    // Reset form
    this.selectedTimeSlot = '';
    alert('¡Reserva confirmada exitosamente!');
  }

  cancelBooking(bookingId: string): void {
    this.bookingsService.cancelBooking(bookingId);
    alert('Reserva cancelada exitosamente.');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}