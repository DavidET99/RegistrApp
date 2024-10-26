import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AsistenciaPageRoutingModule } from './asistencia-routing.module';
import { AsistenciaPage } from './asistencia.page';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciaPageRoutingModule,
    QRCodeModule
  ],
  declarations: [AsistenciaPage]
})
export class AsistenciaPageModule {}
