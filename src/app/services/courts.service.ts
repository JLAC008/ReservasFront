import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Court } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CourtsService {
  private courtsSubject = new BehaviorSubject<Court[]>([
    {
      id: '1',
      name: 'Pista Tenis 1',
      type: 'Tenis',
      pricePerHour: 25,
      description: 'Pista de tenis con superficie de arcilla',
      active: true
    },
    {
      id: '2',
      name: 'Pista Tenis 2',
      type: 'Tenis',
      pricePerHour: 25,
      description: 'Pista de tenis con superficie de cemento',
      active: true
    },
    {
      id: '3',
      name: 'Cancha Fútbol 5',
      type: 'Fútbol',
      pricePerHour: 40,
      description: 'Cancha de fútbol 5 con césped artificial',
      active: true
    },
    {
      id: '4',
      name: 'Pista Pádel 1',
      type: 'Pádel',
      pricePerHour: 30,
      description: 'Pista de pádel cubierta',
      active: true
    }
  ]);

  public courts$ = this.courtsSubject.asObservable();

  constructor() {
    const savedCourts = localStorage.getItem('courts');
    if (savedCourts) {
      this.courtsSubject.next(JSON.parse(savedCourts));
    }
  }

  getCourts(): Court[] {
    return this.courtsSubject.value;
  }

  getActiveCourts(): Court[] {
    return this.getCourts().filter(court => court.active);
  }

  addCourt(court: Omit<Court, 'id'>): void {
    const courts = this.getCourts();
    const newCourt: Court = {
      ...court,
      id: Date.now().toString()
    };
    courts.push(newCourt);
    this.updateCourts(courts);
  }

  updateCourt(courtId: string, updates: Partial<Court>): void {
    const courts = this.getCourts();
    const index = courts.findIndex(c => c.id === courtId);
    if (index !== -1) {
      courts[index] = { ...courts[index], ...updates };
      this.updateCourts(courts);
    }
  }

  deleteCourt(courtId: string): void {
    const courts = this.getCourts().filter(c => c.id !== courtId);
    this.updateCourts(courts);
  }

  private updateCourts(courts: Court[]): void {
    this.courtsSubject.next(courts);
    localStorage.setItem('courts', JSON.stringify(courts));
  }
}