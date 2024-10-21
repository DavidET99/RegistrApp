import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNEPage } from './pagina-ne.page';

const routes: Routes = [
  {
    path: '',
    component: PaginaNEPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaginaNEPageRoutingModule {}
