import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

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
    public nav: NavController
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

    const usuariosGuardados = localStorage.getItem('usuarios');
    let usuarios = [];

    if (usuariosGuardados) {
      usuarios = JSON.parse(usuariosGuardados);
    }

    const adminExiste = usuarios.find((user: any) => user.nombre === admin.nombre);
    if (!adminExiste) {
      usuarios.push(admin);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      console.log('Admin creado');
    }
  }

  async ingresar() {
    const f = this.formlogin.value;

    const usuariosGuardados = localStorage.getItem('usuarios');

    if (usuariosGuardados) {
      const usuarios = JSON.parse(usuariosGuardados);

      const usuarioEncontrado = usuarios.find((user: any) => user.nombre === f.nombre && user.pass === f.pass);

      if (usuarioEncontrado) {
        localStorage.setItem('ingresado', 'true');
        localStorage.setItem('usuarioLogueado', usuarioEncontrado.nombre);
        localStorage.setItem('tipoUsuario', usuarioEncontrado.tipo);
        this.nav.navigateRoot('asistencia');
      } else {
        await this.mostrarAlerta('Datos incorrectos, intente nuevamente');
      }
    } else {
      await this.mostrarAlerta('No hay usuarios registrados');
    }
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
