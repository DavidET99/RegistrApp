import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formRegistro: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public nav: NavController
  ) {
    this.formRegistro = this.fb.group({
      nombre: ['', Validators.required],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      confirmacionpass: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {}

  private passwordMatchValidator(group: FormGroup) {
    const pass = group.get('pass')?.value;
    const confirmacionpass = group.get('confirmacionpass')?.value;

    return pass === confirmacionpass ? null : { mismatch: true };
  }

  async guardar() {
    if (this.formRegistro.invalid) {
      const alert = await this.alertController.create({
        message: 'Por favor, complete todos los campos correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const f = this.formRegistro.value;

    const usuario = {
      nombre: f.nombre,
      pass: f.pass
    };

    const usuariosGuardados = localStorage.getItem('usuarios');
    let usuarios = [];

    if (usuariosGuardados) {
      usuarios = JSON.parse(usuariosGuardados);
    }

    usuarios.push(usuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.nav.navigateRoot('login');
  }
}
