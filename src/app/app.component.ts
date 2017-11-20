import { Component, OnDestroy, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { EsriLoaderService } from 'angular-esri-loader';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  coords: any;
  private url = 'http://localhost:3000';
  private socket;
  title = 'app';
  public pointGraphic: __esri.Graphic;
  public markerSymbol: __esri.SimpleMarkerSymbol;
  public graphicsLayer: __esri.GraphicsLayer;

  @ViewChild(EsriMapComponent) esriMapComponent: EsriMapComponent;

  constructor(private esriLoader: EsriLoaderService) {}

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.socket = io(this.url);
    this.socket.on('messageFromServer', data => {
      console.log('message from server:', this.coords = data);
      this.zoomAndSetMarker(this.coords);
    });
    this.testZoomAndSetMarker(this.coords);
  }

    testZoomAndSetMarker(arg0: any): any {
    throw new Error('Method not implemented.');
  }

  zoomAndSetMarker(coords) {
    let x =  this.esriLoader.loadModules(['esri/Map', 'esri/layers/GraphicsLayer', 'esri/geometry/Point',
    'esri/symbols/SimpleMarkerSymbol', 'esri/Graphic', 'esri/Scene']);


    this.esriLoader.require(['esri/Map', 'esri/layers/GraphicsLayer', 'esri/geometry/Point',
      'esri/symbols/SimpleMarkerSymbol', 'esri/Graphic', 'esri/Map'],
      (Map, GraphicsLayer, Point, SimpleMarkerSymbol, Graphic) => {
        console.log('x = ', coords.x);
        console.log('y = ', coords.y);
        this.markerSymbol = new SimpleMarkerSymbol({
          color: [226, 119, 40],
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
        });
        this.pointGraphic = new Graphic({
          geometry: new Point({
            longitude: coords.x,
            latitude: coords.y
          })
        });

        this.pointGraphic.symbol = this.markerSymbol;
        this.esriMapComponent.MapView.goTo({
          center: [coords.x, coords.y],
          zoom: 17
        });
        // this.esriMapComponent.mapView.graphics.removeAll();
        this.esriMapComponent.MapView.graphics.add(this.pointGraphic);
      });

  }

}