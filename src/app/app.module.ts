import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { NgPrimeModule } from './ng-prime/ng-prime.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgPrimeModule,
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD1I0YWkHHVf9PsCMmSp0b7hszAneXM6yQ'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
