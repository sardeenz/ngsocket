import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  DoCheck,
  AfterViewInit
} from "@angular/core";
import * as io from "socket.io-client";
import { EsriLoaderService } from "angular-esri-loader";
import { EsriMapComponent } from "./esri-map/esri-map.component";
import { ViewChild } from "@angular/core";
import { GetAllCrashesService } from "./get-all-crashes.service";
import { Subscription } from "rxjs/Subscription";
import { RedisLocations } from "./redis-locations";

// let redis = require('redis'),
// client = redis.createClient();

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  crashLocation = 'first';
  mapLoaded: Element;
  y: any;
  x: any;
  public mymap: any;
  crashLocations: string[];

  coords: any;
  private url = 'http://localhost:3000';
  private socket;
  title = 'app';
  public pointGraphic: __esri.Graphic;
  public markerSymbol: __esri.SimpleMarkerSymbol;
  public graphicsLayer: __esri.GraphicsLayer;
  redisLocations = new RedisLocations();
  redisLocationsArr: string[];

  @ViewChild(EsriMapComponent) esriMapComponent: EsriMapComponent;

  // @ViewChild('map') mapEl: ElementRef;
  // map: any;

  constructor(private esriLoader: EsriLoaderService) {}

  ngAfterViewInit() {
    // console.log('afterinit ', this.esriMapComponent.maploaded);
    // this.esriMapComponent.MapView.then(function() {
    //   this.loadCrashes();
    // });

    // this is a hack to allow the map to finish loading
    setTimeout(() => {
      this.loadCrashes();
    }, 1500);
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // console.log('is map loaded?', this.esriMapComponent.maploaded);
    // display all points stored in redis db

    // listen for new tweets of crashes, and animate to map
    this.socket = io(this.url);
    this.socket.on('messageFromServer', data => {
      console.log('messagefromServer:', (this.coords = data));

      if (this.coords) {
        this.esriMapComponent.zoomAndSetMarker(this.coords);
      }
    });
    this.socket.on('crashLocation', data => {
      console.log('crashLocation:', this.crashLocation = data);
      // this.crashLocations.push(this.crashLocation);
      // this.crashLocations.push(data);
    });

  }

  loadCrashes() {
    this.esriMapComponent.getAll();
  }
}
