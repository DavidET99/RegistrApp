import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formlogin: FormGroup;

  constructor(public fb: FormBuilder,
              public alertController: AlertController,
              public nav: NavController) {

    this.formlogin = this.fb.group({
      nombre: ['', Validators.required],
      pass: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async ingresar() {
    const f = this.formlogin.value;

    const usuariosGuardados = localStorage.getItem('usuarios');

    if (usuariosGuardados) {
      const usuarios = JSON.parse(usuariosGuardados);

      const usuarioEncontrado = usuarios.find((user: any) => user.nombre === f.nombre && user.pass === f.pass);

      if (usuarioEncontrado) {
        console.log('Ingresado');
        localStorage.setItem('ingresado', 'true');
        localStorage.setItem('usuarioLogueado', usuarioEncontrado.nombre);
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
