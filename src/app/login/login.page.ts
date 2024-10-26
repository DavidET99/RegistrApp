import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formlogin: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public nav: NavController,
    private storageService: StorageService
  ) {
    this.formlogin = this.fb.group({
      nombre: ['', Validators.required],
      pass: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.Admin();
  }

  Admin() {
    const admin = {
      nombre: 'profesor',
      pass: 'admin123',
      tipo: 'admin'
    };

    this.storageService.get('usuarios').then(usuariosGuardados => {
      let usuarios = usuariosGuardados ? usuariosGuardados : [];

      const adminExiste = usuarios.find((user: any) => user.nombre === admin.nombre);
      if (!adminExiste) {
        usuarios.push(admin);
        this.storageService.set('usuarios', usuarios);
        console.log('Admin creado');
      }
    });
  }

  async ingresar() {
    const f = this.formlogin.value;

    const usuariosGuardados = await this.storageService.get('usuarios');

    if (usuariosGuardados) {
      const usuarioEncontrado = usuariosGuardados.find((user: any) => user.nombre === f.nombre && user.pass === f.pass);

      if (usuarioEncontrado) {
        await this.storageService.set('ingresado', 'true');
        await this.storageService.set('usuarioLogueado', usuarioEncontrado.nombre);
        await this.storageService.set('tipoUsuario', usuarioEncontrado.tipo);
        this.nav.navigateRoot('asistencia');
      } else {
        await this.mostrarAlerta('Datos incorrectos, intente nuevamente');
      }
    } else {
      await this.mostrarAlerta('No hay usuarios registrados');
    }
  }

  private async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
