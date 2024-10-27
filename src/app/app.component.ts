import { Component, OnInit } from '@angular/core';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    await this.ensureAdminExists();
  }

  async ensureAdminExists() {
    const admin = {
      nombre: 'profesor',
      pass: 'admin123',
      tipo: 'admin'
    };

    const usuariosGuardados = await this.storageService.get('usuarios');
    let usuarios = usuariosGuardados ? usuariosGuardados : [];

    const adminExiste = usuarios.some((user: any) => user.nombre === admin.nombre);
    if (!adminExiste) {
      usuarios.push(admin);
      await this.storageService.set('usuarios', usuarios);
      console.log('Admin creado');
    }
  }
}
