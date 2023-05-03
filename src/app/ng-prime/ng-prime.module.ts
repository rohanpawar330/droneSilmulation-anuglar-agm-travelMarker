import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';

const moduleArray = [ButtonModule, InputNumberModule, DividerModule, SkeletonModule]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...moduleArray
  ],
  exports: [...moduleArray]
})
export class NgPrimeModule { }
