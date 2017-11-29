import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// also import the "angular2-esri-loader" to be able to load JSAPI modules
import { EsriLoaderService } from 'angular-esri-loader';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  public MapView: __esri.MapView;
  public maploaded: Element;
  public pointGraphic: __esri.Graphic;
  public markerSymbol: __esri.SimpleMarkerSymbol;
  public graphicsLayer: __esri.GraphicsLayer;

  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private esriLoader: EsriLoaderService
  ) { }

  public ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader.load({
      // use a specific version of the JSAPI
      url: 'https://js.arcgis.com/4.6/'
    }).then(() => {
      // load the needed Map and MapView modules from the JSAPI
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/Graphic',
        'esri/layers/GraphicsLayer'
      ]).then(([
        Map,
        MapView,
        Point,
        SimpleMarkerSymbol,
        Graphic,
        GraphicsLayer
      ]) => {
        const mapProperties: __esri.MapProperties = {
          basemap: 'topo' as any as __esri.BasemapProperties
        };
        const map = new Map(mapProperties);
          const mapViewProperties: __esri.MapViewProperties = {
          container: this.mapViewEl.nativeElement,
          center: [-78.65, 35.8] as any as __esri.PointProperties,
          zoom: 10,
          map
        };
        this.MapView = new MapView(mapViewProperties);
        this.maploaded = this.esriLoader.isLoaded();
        console.log(this.maploaded);
      });
    });
  }

  setMarkers(x, y) {
    this.esriLoader.loadModules(['esri/Map', 'esri/layers/GraphicsLayer', 'esri/geometry/Point',
    'esri/symbols/SimpleMarkerSymbol', 'esri/Graphic', 'esri/Map']).then(([Map, GraphicsLayer, Point, SimpleMarkerSymbol, Graphic]) => {
      console.log('x = ', x);
      console.log('y = ', y);
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
      // this.esriMapComponent.MapView.goTo({
      //   center: [coords.x, coords.y],
      //   zoom: 17
      // });
      // this.esriMapComponent.mapView.graphics.removeAll();
      this.MapView.graphics.add(this.pointGraphic);
    });

  }

  // This gets called when there's a new tweet
  zoomAndSetMarker(coords) {
    console.log('is map loaded? we are now in esri-map.component', this.maploaded);
    this.esriLoader.loadModules(['esri/Map', 'esri/layers/GraphicsLayer', 'esri/geometry/Point',
      'esri/symbols/SimpleMarkerSymbol', 'esri/Graphic', 'esri/Map']).then(([Map, GraphicsLayer, Point, SimpleMarkerSymbol, Graphic]) => {
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
        this.MapView.goTo({
          center: [coords.x, coords.y],
          zoom: 17
        });

        // this.esriMapComponent.mapView.graphics.removeAll();
        this.MapView.graphics.add(this.pointGraphic);
      });

  }

}
