import { Component, Injector, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ClimaService } from '../services/clima.service';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
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
  isModalOpenTable = false;
  esAdmin: boolean = false;
  climaInfo: any;
  qrCodeData: string = '';
  isSupported = false;
  asistencias: any[] = [];


  private climaService: ClimaService;

  constructor(
    private nav: NavController,
    private storageService: StorageService,
    private injector: Injector,
    private alertController: AlertController
  ) {
    this.climaService = this.injector.get(ClimaService);
  }

  private ASIGNATURAS: Record<number, { nombre: string; seccion: string; sala: string }> = {
    1: { nombre: 'Programación de apps móviles', seccion: '005D', sala: '308' },
    2: { nombre: 'Deep Learning', seccion: '001D', sala: 'L4' },
    3: { nombre: 'Proceso de portafolio 6', seccion: '010D', sala: '804' }
  };

  async ngOnInit() {
    this.nombreUsuario = await this.storageService.get('usuarioLogueado');
    const tipoUsuario = await this.storageService.get('tipoUsuario');
    this.esAdmin = tipoUsuario === 'admin';
    this.isSupported = true;
    this.getClimaData();
    const hasPermission = await this.requestLocationPermission();
    if (hasPermission) {
      this.getClimaData();
    } else {
      console.error('No se puede acceder a la ubicación sin permisos.');
    }

  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      const permissions: PermissionStatus = await Geolocation.checkPermissions();
      if (permissions.location === 'granted') {
        console.log('Permiso ya otorgado');
        return true;
      }
      if (permissions.location === 'denied') {
        return false;
      }

      const request: PermissionStatus = await Geolocation.requestPermissions();
      if (request.location === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async getClimaData() {
    try {

      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      const lat = coordinates.coords.latitude;
      const lon = coordinates.coords.longitude;

      this.climaService.getClima(lat, lon).subscribe((data) => {
        this.climaInfo = data;
      });
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
    }
  }


  onGenerateCode(asignaturaId: number) {
    if (!this.esAdmin) {
      return;
    }
    const asignatura = this.ASIGNATURAS[asignaturaId];
    const fechaActual = new Date().toISOString().split('T')[0];
    this.qrCodeData = `${asignaturaId}|${asignatura.seccion}|${asignatura.sala}|${fechaActual}`;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = true;
      this.isModalOpen = true;
    }, 1500);
  }

  async scanQRCode(asignaturaId: number) {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL
      });

      const scannedData = result.ScanResult?.trim();
      const asignatura = this.ASIGNATURAS[asignaturaId];
      const fechaActual = new Date().toISOString().split('T')[0];
      const validQRCodeData = `${asignaturaId}|${asignatura.seccion}|${asignatura.sala}|${fechaActual}`;

      if (scannedData) {
        if (scannedData === validQRCodeData) {
          const asistenciaKey = `asistencia_${this.nombreUsuario}_${asignaturaId}_${fechaActual}`;
          const asistenciaExistente = await this.storageService.get(asistenciaKey);

          if (asistenciaExistente) {
            alert('Ya se registró asistencia para esta asignatura el día de hoy.');
            return;
          }
          await this.storageService.set(asistenciaKey, {
            nombre: asignatura.nombre,
            fecha: fechaActual,
            seccion: asignatura.seccion,
            sala: asignatura.sala
          });
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


  async verAsistencias() {
    this.asistencias = [];
    const keys = await this.storageService.getAllKeys();

    for (const key of keys) {
      if (key.startsWith('asistencia_')) {
        const { nombre, fecha, seccion, sala } = await this.storageService.get(key);
        const usuario = key.split('_')[1];
        this.asistencias.push(
          `Usuario: ${usuario} - ${nombre} - Sección: ${seccion} - Sala: ${sala} - Fecha: ${fecha} - Presente`
        );
      }
    }
    if (this.asistencias.length === 0) {
      const alert = await this.alertController.create({
        header: 'Sin asistencias',
        message: 'No hay asistencias registradas.',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.isModalOpenTable = true;
    }
  }

  async logout() {
    await this.storageService.remove('ingresado');
    await this.storageService.remove('usuarioLogueado');
    await this.storageService.remove('tipoUsuario');
    this.nav.navigateRoot('/login');
  }
}
