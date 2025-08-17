import {UserRole} from "./user-roles.enum";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Court {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
  description: string;
  active: boolean;
}

export interface TimeSlot {
  hour: string;
  available: boolean;
  bookedBy?: string;
  bookingId?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courtId: string;
  courtName: string;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface DaySchedule {
  date: string;
  timeSlots: TimeSlot[];
}