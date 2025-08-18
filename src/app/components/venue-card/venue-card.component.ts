import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venue-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-4">
      <h3 class="text-lg font-bold text-gray-800">{{ venue.name }}</h3>
      <p class="text-sm text-gray-600">Deporte: {{ venue.sport }}</p>
      <p class="text-sm text-gray-600">Ubicación: {{ venue.location }}</p>
    </div>
  `
})
export class VenueCardComponent {
  @Input() venue!: { id: number; name: string; sport: string; location: string };
}
