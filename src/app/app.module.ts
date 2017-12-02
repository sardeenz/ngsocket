import {HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { EsriLoaderService } from 'angular-esri-loader';
import { GetAllCrashesService } from './get-all-crashes.service';
import { MapServiceService } from './map-service.service';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [EsriLoaderService, GetAllCrashesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
