import { Component, Injector, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ClimaService } from '../services/clima.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  nombreUsuario: string | null = '';
  isModalOpen = false;
  isLoading = false;
  esAdmin: boolean = false;
  climaInfo: any;

  private climaService: ClimaService;

  constructor(private nav: NavController, private injector: Injector) {
    this.climaService = this.injector.get(ClimaService);
  }

  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('usuarioLogueado');
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    this.esAdmin = tipoUsuario === 'admin';

    this.getClimaData();
  }

  async getClimaData() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lon = coordinates.coords.longitude;

      this.climaService.getClima(lat, lon).subscribe((data) => {
        this.climaInfo = data;
        console.log('Información del clima:', data);
      });
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
    }
  }

  onGenerateCode() {
    if (!this.esAdmin) {
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.isModalOpen = true;
    }, 3000);
  }

  logout() {
    localStorage.removeItem('ingresado');
    localStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('tipoUsuario');
    this.nav.navigateRoot('/login');
  }
}
