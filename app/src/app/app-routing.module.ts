import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormParametersComponent } from './form-parameters/form-parameters.component';


const routes: Routes = [
  {
    path: '',
    component: FormParametersComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
