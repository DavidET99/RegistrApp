import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('usuarioLogueado');
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    this.esAdmin = tipoUsuario === 'admin';
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
}
