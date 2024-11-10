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
  asistencias: string[] = [];

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
    const fechaActual = new Date().toISOString().split('T')[0];
    this.qrCodeData = `Asistencia-${fechaActual}`;
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

        const scannedData = result.ScanResult?.trim();
        const fechaActual = new Date().toISOString().split('T')[0];
        const validQRCodeData = `Asistencia-${fechaActual}`;

        if (scannedData) {
            console.log('Código esperado:', validQRCodeData);
            console.log('Código escaneado:', scannedData);
            console.log('Usuario:', this.nombreUsuario);

            if (scannedData === validQRCodeData) {
                await this.storageService.set(`presente_${this.nombreUsuario}`, true);
                console.log(`Asistencia registrada: presente_${this.nombreUsuario} = true`);
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

  async verAsistencias() {
    this.asistencias = [];
    const keys = await this.storageService.getAllKeys();
    console.log('Claves almacenadas:', keys);

    for (const key of keys) {
        if (key.startsWith('presente_')) {
            const usuario = key.replace('presente_', '');
            const isPresente = await this.storageService.get(key);
            console.log(`Clave: ${key}, Usuario: ${usuario}, Presente: ${isPresente}`);
            if (isPresente) {
                this.asistencias.push(usuario);
            }
        }
    }

    this.mostrarAsistencias();
}


  async mostrarAsistencias() {
    const alert = await this.alertController.create({
      header: 'Lista de Asistencias',
      message: this.asistencias.length
        ? this.asistencias.join('<br>')
        : 'No hay registros de asistencia',
      buttons: ['OK']
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
