import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  formRecuperar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private alertController: AlertController,
    private nav: NavController
  ) {
    this.formRecuperar = this.fb.group({
      nombre: ['', Validators.required],
      nuevaPass: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async recuperar() {
    const f = this.formRecuperar.value;
    const usuariosGuardados = await this.storageService.get('usuarios');
    const usuario = usuariosGuardados?.find((user: any) => user.nombre === f.nombre);

    if (usuario) {
      usuario.pass = f.nuevaPass;
      await this.storageService.set('usuarios', usuariosGuardados);
      await this.mostrarAlerta('Contraseña actualizada correctamente.');
      this.nav.navigateRoot('login');
    } else {
      await this.mostrarAlerta('Usuario no encontrado.');
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
