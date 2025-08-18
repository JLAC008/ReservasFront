import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VenueCardComponent } from '../venue-card/venue-card.component';

@Component({
  selector: 'app-sport-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, VenueCardComponent],
  templateUrl: './courts.component.html'
})
export class CourtsComponent {
  date: string = '';
  sport: string = '';
  location: string = '';

  sportOptions = ['Todos','Fútbol', 'Tenis', 'Pádel', 'Baloncesto'];
  locationOptions = ['Todos','Madrid', 'Barcelona', 'Valencia', 'Sevilla'];

  venues = [
    { id: 1, name: 'Polideportivo Central', sport: 'Fútbol', location: 'Madrid' },
    { id: 2, name: 'Club Tenis Norte', sport: 'Tenis', location: 'Barcelona' },
    { id: 3, name: 'Pádel Arena', sport: 'Pádel', location: 'Valencia' },
  ];

  get filteredVenues() {
    return this.venues.filter(v =>
      (!this.sport || v.sport === this.sport) &&
      (!this.location || v.location === this.location)
    );
  }

  handleFilter() {
    console.log('Buscando con filtros:', this.date, this.sport, this.location);
  }
}
