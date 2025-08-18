import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {CardModule} from 'primeng/card';
import {AutoComplete} from 'primeng/autocomplete';
import {InputTextModule} from 'primeng/inputtext';


interface Court {
  name: string;
  sport: string;
  location: string;
  image: string;
  availableDate: string;
}

@Component({
  selector: 'app-courts',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePicker, CardModule, AutoComplete, InputTextModule],
  templateUrl: './courts.component.html'
})
export class CourtsComponent implements OnInit {
  ngOnInit() {
    // Inicializar filtros
    this.onFilterChange();
  }

  // Listas completas para autocomplete
  allSports = ['Fútbol', 'Tenis', 'Baloncesto', 'Padel'];
  allLocations = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'];

  // Sugerencias filtradas para autocomplete
  sportSuggestions: string[] = [];
  locationSuggestions: string[] = [];

  // Valores seleccionados/escritos
  selectedSport: string = '';
  selectedLocation: string = '';
  selectedDate: Date | null = null;
  currentDateInput: string = ''; // Para capturar lo que se escribe

  courts: Court[] = [
    {
      name: 'Cancha Central',
      sport: 'Fútbol',
      location: 'Madrid',
      image: 'https://via.placeholder.com/300x200',
      availableDate: new Date().toLocaleDateString("es-ES")
    },
    {
      name: 'Club Tenis Norte',
      sport: 'Tenis',
      location: 'Barcelona',
      image: 'https://via.placeholder.com/300x200',
      availableDate: new Date().toLocaleDateString("es-ES")
    },
    {
      name: 'Polideportivo Sur',
      sport: 'Baloncesto',
      location: 'Valencia',
      image: 'https://via.placeholder.com/300x200',
      availableDate: new Date().toLocaleDateString("es-ES")
    },
    {
      name: 'Padel Center',
      sport: 'Padel',
      location: 'Sevilla',
      image: 'https://via.placeholder.com/300x200',
      availableDate: new Date().toLocaleDateString("es-ES")
    },
    // Añadir más pistas para probar el filtrado
    {
      name: 'Tenis Club Elite',
      sport: 'Tenis',
      location: 'Madrid',
      image: 'https://via.placeholder.com/300x200',
      availableDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString("es-ES")
    },
    {
      name: 'Cancha de Fútbol Sala',
      sport: 'Fútbol',
      location: 'Barcelona',
      image: 'https://via.placeholder.com/300x200',
      availableDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString("es-ES")
    },
  ];

  private _filteredCourts: Court[] = [...this.courts];

  private normalize(str: string): string {
    return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  }

  onFilterChange() {
    this._filteredCourts = this.courts.filter(court => {
      // Filtro por deporte
      const matchSport = !this.selectedSport.trim() ||
          this.normalize(court.sport).includes(this.normalize(this.selectedSport));

      // Filtro por ubicación
      const matchLocation = !this.selectedLocation.trim() ||
          this.normalize(court.location).includes(this.normalize(this.selectedLocation));

      // Filtro por fecha (nueva lógica)
      const [day, month, year] = court.availableDate.split('/').map(Number);
      const fecha = new Date(year, month - 1, day);
      const matchDate = this.matchesDateFilter(fecha);

      return matchSport && matchLocation && matchDate;
    });
  }

private matchesDateFilter(courtDate: Date): boolean {
  // Si no hay ningún filtro de fecha, mostrar todo
  if (!this.currentDateInput.trim() && !this.selectedDate) {
    return true;
  }

  // Filtrado parcial
  if (this.currentDateInput.trim()) {
    return this.matchesPartialDate(courtDate, this.currentDateInput);
  }

  // Filtrado exacto
  if (this.selectedDate) {
    // Convertir a Date si es string
    const selected = (this.selectedDate instanceof Date)
      ? this.selectedDate
      : new Date(this.selectedDate);

    // Verificar que sea una fecha válida
    if (isNaN(selected.getTime())) return false;

    return courtDate.toDateString() === selected.toDateString();
  }

  return true;
}


  private matchesPartialDate(date: Date, filterText: string): boolean {
    // Formatear la fecha de la pista como dd/mm/yyyy
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    const fullDateString = `${day}/${month}/${year}`;

    // Limpiar el texto de filtro y remover espacios
    const cleanFilter = filterText.trim().replace(/\s/g, '');

    // Si es solo números (día)
    if (/^\d{1,2}$/.test(cleanFilter)) {
      const dayFilter = cleanFilter.padStart(2, '0');
      return day === dayFilter;
    }

    // Si tiene formato día/mes
    if (/^\d{1,2}\/\d{1,2}$/.test(cleanFilter)) {
      const parts = cleanFilter.split('/');
      const dayFilter = parts[0].padStart(2, '0');
      const monthFilter = parts[1].padStart(2, '0');
      return day === dayFilter && month === monthFilter;
    }

    // Si tiene formato día/mes/año
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(cleanFilter)) {
      const parts = cleanFilter.split('/');
      const dayFilter = parts[0].padStart(2, '0');
      const monthFilter = parts[1].padStart(2, '0');
      let yearFilter = parts[2];

      // Si el año es de 2 dígitos, asumir 20xx
      if (yearFilter.length === 2) {
        yearFilter = '20' + yearFilter;
      }

      return day === dayFilter && month === monthFilter && year === yearFilter;
    }

    // Búsqueda general en el string completo
    return fullDateString.includes(cleanFilter);
  }

  // Método para filtrar deportes (autocomplete)
  filterSports(event: any) {
    const query = this.normalize(event.query || '');
    this.sportSuggestions = this.allSports.filter(sport =>
        this.normalize(sport).includes(query)
    );
  }

  // Método para filtrar ubicaciones (autocomplete)
  filterLocations(event: any) {
    const query = this.normalize(event.query || '');
    this.locationSuggestions = this.allLocations.filter(location =>
        this.normalize(location).includes(query)
    );
  }

  // Eventos de cambio para filtrado en tiempo real
  onSportChange() {
    this.onFilterChange();
  }

  onLocationChange() {
    this.onFilterChange();
  }

  // NUEVOS MÉTODOS: Para manejar la limpieza de los autocomplete
  onSportClear() {
    this.selectedSport = '';
    this.onFilterChange();
  }

  onLocationClear() {
    this.selectedLocation = '';
    this.onFilterChange();
  }

  // NUEVOS MÉTODOS: Para manejar cambios en el modelo directamente
  onSportModelChange(value: string | null) {
    this.selectedSport = value || '';
    this.onFilterChange();
  }

  onLocationModelChange(value: string | null) {
    this.selectedLocation = value || '';
    this.onFilterChange();
  }

  // Eventos para el date-picker con input en tiempo real
  onDateInput(event: any) {
    // Capturar el valor del input mientras se escribe
    const inputValue = event.target?.value || '';
    this.currentDateInput = inputValue;

    // CAMBIO CLAVE: Si el input está vacío, resetear completamente el estado de fecha
    if (!inputValue.trim()) {
      this.selectedDate = null;
      this.currentDateInput = '';
    }

    // Filtrar en tiempo real
    this.onFilterChange();
  }

  onDateChange(date: Date | null) {
    this.selectedDate = date;

    // CAMBIO CLAVE: Si la fecha es null (se borró), asegurar que ambas variables se reseteen
    if (!date) {
      this.selectedDate = null;
      this.currentDateInput = '';
    } else {
      // Si se selecciona una fecha válida, limpiar el input parcial
      this.currentDateInput = '';
    }

    this.onFilterChange();
  }

  onDateSelect(date: Date) {
    this.selectedDate = date;
    this.currentDateInput = '';
    this.onFilterChange();
  }

  onDateClear() {
    // CAMBIO CLAVE: Resetear completamente ambas variables
    this.selectedDate = null;
    this.currentDateInput = '';
    this.onFilterChange();
  }

  // MÉTODO ADICIONAL: Para manejar el evento de borrado manual completo
  onDateBlur(event: any) {
    const inputValue = event.target?.value || '';
    // Si el campo queda vacío después de perder el foco, resetear todo
    if (!inputValue.trim()) {
      this.selectedDate = null;
      this.currentDateInput = '';
      this.onFilterChange();
    }
  }

  get filteredCourts(): Court[] {
    return this._filteredCourts;
  }
}