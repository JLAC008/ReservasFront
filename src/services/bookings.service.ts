import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Booking, TimeSlot, DaySchedule } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  private timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  constructor() {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      this.bookingsSubject.next(JSON.parse(savedBookings));
    }
  }

  getBookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  getUserBookings(userId: string): Booking[] {
    return this.getBookings().filter(booking => booking.userId === userId);
  }

  createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): void {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    this.updateBookings(bookings);
  }

  cancelBooking(bookingId: string): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = 'cancelled';
      this.updateBookings(bookings);
    }
  }

  getCourtSchedule(courtId: string, date: string): DaySchedule {
    const bookings = this.getBookings().filter(
      b => b.courtId === courtId && b.date === date && b.status === 'confirmed'
    );

    const timeSlots: TimeSlot[] = this.timeSlots.map(hour => {
      const booking = bookings.find(b => b.timeSlot === hour);
      return {
        hour,
        available: !booking,
        bookedBy: booking?.userName,
        bookingId: booking?.id
      };
    });

    return { date, timeSlots };
  }

  private updateBookings(bookings: Booking[]): void {
    this.bookingsSubject.next(bookings);
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }
}