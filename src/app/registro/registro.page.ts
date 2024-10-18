import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

interface Usuario {
  nombre: string;
  pass: string;
  tipo: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formRegistro: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private nav: NavController
  ) {
    this.formRegistro = this.fb.group({
      nombre: ['', Validators.required],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      confirmacionpass: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {}

  private passwordMatchValidator(group: FormGroup) {
    return group.get('pass')?.value === group.get('confirmacionpass')?.value ? null : { mismatch: true };
  }

  async guardar() {
    if (this.formRegistro.invalid) {
      await this.mostrarAlerta('Por favor, complete todos los campos correctamente.');
      return;
    }

    const f = this.formRegistro.value;

    const usuario: Usuario = {
      nombre: f.nombre,
      pass: f.pass,
      tipo: 'alumno'
    };

    this.guardarUsuario(usuario);

    this.nav.navigateRoot('login');
  }

  private guardarUsuario(usuario: Usuario) {
    const usuariosGuardados = localStorage.getItem('usuarios');
    const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  private async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
