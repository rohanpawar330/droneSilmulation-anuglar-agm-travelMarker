import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputNumberModule
  ],
  exports: [InputNumberModule]
})
export class NgPrimeModule { }
