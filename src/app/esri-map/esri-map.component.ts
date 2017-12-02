import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// also import the "angular2-esri-loader" to be able to load JSAPI modules
import { EsriLoaderService } from 'angular-esri-loader';
import { GetAllCrashesService } from '../get-all-crashes.service';
import { MapServiceService } from '../map-service.service';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  floatx: number;
  floaty: number;
  y: number;
  x: number;
  map: any;

  public MapView: __esri.MapView;
  public maploaded: boolean;
  public pointGraphic: __esri.Graphic;
  public markerSymbol: __esri.SimpleMarkerSymbol;
  public graphicsLayer: __esri.GraphicsLayer;

  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private esriLoader: EsriLoaderService,
    private getAllCrashes: GetAllCrashesService,
    // private mapService: MapServiceService
  ) {}

  // public ngOnInit() {
  //   this.mapService.buildMap();
  // }
  public ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader
      .load({
        // use a specific version of the JSAPI
        url: 'https://js.arcgis.com/4.6/'
      })
      .then(() => {
        // load the needed Map and MapView modules from the JSAPI
        this.esriLoader
          .loadModules([
            'esri/Map',
            'esri/views/MapView',
            'esri/geometry/Point',
            'esri/symbols/SimpleMarkerSymbol',
            'esri/Graphic',
            'esri/layers/GraphicsLayer'
          ])
          .then(
            (
              [Map, MapView, Point, SimpleMarkerSymbol, Graphic, GraphicsLayer]
            ) => {
              const mapProperties: __esri.MapProperties = {
                basemap: ('topo' as any) as __esri.BasemapProperties
              };
              const map = new Map(mapProperties);
              const mapViewProperties: __esri.MapViewProperties = {
                container: this.mapViewEl.nativeElement,
                center: ([-78.65, 35.8] as any) as __esri.PointProperties,
                zoom: 10,
                map
              };
              this.MapView = new MapView(mapViewProperties);
              this.maploaded = this.MapView.initialized;
              console.log('initMapLoaded = ' , this.maploaded);

            }
          );
      });
  }

  setMarkers(x, y) {
    this.esriLoader.require(['esri/Map', 'esri/layers/GraphicsLayer', 'esri/geometry/Point',
    'esri/symbols/SimpleMarkerSymbol', 'esri/Graphic'],
    (Map, GraphicsLayer, Point, SimpleMarkerSymbol, Graphic) => {
      // console.log('x = ', x);
      // console.log('y = ', typeof y);
      this.markerSymbol = new SimpleMarkerSymbol({
        color: [226, 119, 40],
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 2
        }
      });
      this.pointGraphic = new Graphic({
        geometry: new Point({
          longitude: x,
          latitude: y
        })
      });
      this.pointGraphic.symbol = this.markerSymbol;
      this.MapView.graphics.add(this.pointGraphic);
    });

  }

  // This gets called when there's a new tweet
  zoomAndSetMarker(coords) {
    // must be numbers not strings
    this.floatx = parseFloat(coords.x);
    this.floaty = parseFloat(coords.y);
    
    this.esriLoader
      .loadModules([
        'esri/Map',
        'esri/layers/GraphicsLayer',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/Graphic',
        'esri/Map'
      ])
      .then(([Map, GraphicsLayer, Point, SimpleMarkerSymbol, Graphic]) => {
        console.log('x = ', this.floatx);
        console.log('y = ', this.floaty);
        this.markerSymbol = new SimpleMarkerSymbol({
          color: [226, 119, 40],
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
          }
        });
        this.pointGraphic = new Graphic({
          geometry: new Point({
            longitude: this.floatx,
            latitude: this.floaty
          })
        });
        this.pointGraphic.symbol = this.markerSymbol;
        this.MapView.goTo({center: [this.floatx, this.floaty], zoom: 17});
        this.MapView.graphics.add(this.pointGraphic);

      });
  }

  getAll() {
    this.MapView.graphics.removeAll();
    this.getAllCrashes.getGeometry().subscribe(
      redisLocations => {
        for (const redisLocation in redisLocations) {
          if (redisLocation) {
            this.x = redisLocations[redisLocation].longitude;
            this.y = redisLocations[redisLocation].latitude;
            // convert string to float for esri compatibility
            // this.x = parseFloat(this.x);
            // this.y = parseFloat(this.y);
            // this.redisLocationsArr.push() -- CHF possibly create a Multipoint array and just send that?
            this.setMarkers(this.x, this.y);
          }
        }
      },
      err => {
        console.log('some error happened');
      }
    );
  }
}
