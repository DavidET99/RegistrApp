import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

interface Usuario {
  nombre: string;
  pass: string;
  tipo: string;
  asignaturas: Asignatura[];
}

interface Asignatura {
  id: number;
  nombre: string;
  seccion: string;
  sala: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formRegistro: FormGroup;

  private asignaturasPredefinidas: Asignatura[] = [
    { id: 1, nombre: 'Programación de aplicaciones móviles', seccion: '005D', sala: '308' },
    { id: 2, nombre: 'Deep Learning', seccion: '001D', sala: 'L4' },
    { id: 3, nombre: 'Proceso de portafolio 6', seccion: '010D', sala: '804' }
  ];

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private nav: NavController,
    private storageService: StorageService
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
      tipo: 'alumno',
      asignaturas: this.asignaturasPredefinidas.map(asignatura => ({
        ...asignatura,
        asistenciaId: `asistencia_${f.nombre}_${asignatura.id}`
      }))
    };

    // Guardar en Storage
    const usuariosGuardados = await this.storageService.get('usuarios');
    let usuarios = usuariosGuardados ? usuariosGuardados : [];

    usuarios.push(usuario);
    await this.storageService.set('usuarios', usuarios);

    console.log(`Usuario registrado con asignaturas: ${JSON.stringify(usuario.asignaturas)}`);
    this.nav.navigateRoot('login');
  }

  private async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
