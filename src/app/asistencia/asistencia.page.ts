import { Component, Injector, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ClimaService } from '../services/clima.service';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from '../services/storage.service';

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
  qrCodeData: string = '';

  private climaService: ClimaService;

  constructor(private nav: NavController,private storageService: StorageService, private injector: Injector) {
    this.climaService = this.injector.get(ClimaService);
  }

  async ngOnInit() {
    this.nombreUsuario = await this.storageService.get('usuarioLogueado');
    const tipoUsuario = await this.storageService.get('tipoUsuario');
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

    this.qrCodeData = `Asistencia - ${this.nombreUsuario} - ${new Date().toLocaleString()}`;

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.isModalOpen = true;
    }, 3000);
  }

  async logout() {
    await this.storageService.remove('ingresado');
    await this.storageService.remove('usuarioLogueado');
    await this.storageService.remove('tipoUsuario');
    this.nav.navigateRoot('/login');
  }
}
