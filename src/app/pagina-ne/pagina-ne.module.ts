import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaginaNEPageRoutingModule } from './pagina-ne-routing.module';

import { PaginaNEPage } from './pagina-ne.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaginaNEPageRoutingModule
  ],
  declarations: [PaginaNEPage]
})
export class PaginaNEPageModule {}
