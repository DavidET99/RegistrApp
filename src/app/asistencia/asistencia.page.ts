import { Component, Injector, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ClimaService } from '../services/clima.service';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from '../services/storage.service';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

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
  isSupported = false;

  private climaService: ClimaService;

  constructor(
    private nav: NavController,
    private storageService: StorageService,
    private injector: Injector,
    private alertController: AlertController
  ) {
    this.climaService = this.injector.get(ClimaService);
  }

  async ngOnInit() {
    this.nombreUsuario = await this.storageService.get('usuarioLogueado');
    const tipoUsuario = await this.storageService.get('tipoUsuario');
    this.esAdmin = tipoUsuario === 'admin';
    this.isSupported = true;
    this.getClimaData();
  }

  async getClimaData() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lon = coordinates.coords.longitude;
      this.climaService.getClima(lat, lon).subscribe((data) => {
        this.climaInfo = data;
      });
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
    }
  }

  onGenerateCode() {
    if (!this.esAdmin) {
      return;
    }
    this.qrCodeData = `Asistencia-${new Date().toISOString()}`;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.isModalOpen = true;
    }, 3000);
  }

  async scanQRCode() {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL
      });

      const scannedData = result.ScanResult;
      if (scannedData) {
        if (scannedData === this.qrCodeData) {
          await this.storageService.set(`presente_${this.nombreUsuario}`, true);
          alert('Asistencia registrada correctamente');
        } else {
          alert('Código QR no válido para esta sesión de asistencia');
        }
      } else {
        alert('No se encontró ningún código QR o el escaneo fue cancelado.');
      }
    } catch (error) {
      console.error('Error escaneando el código QR:', error);
      alert('Hubo un problema escaneando el código QR. Intente de nuevo.');
    }
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Por favor, conceda permiso a la cámara para usar el escáner de códigos.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async logout() {
    await this.storageService.remove('ingresado');
    await this.storageService.remove('usuarioLogueado');
    await this.storageService.remove('tipoUsuario');
    this.nav.navigateRoot('/login');
  }
}
