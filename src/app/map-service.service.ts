import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { EsriLoaderService } from 'angular-esri-loader';

@Injectable()
export class MapServiceService {

  public MapView: __esri.MapView;
  public maploaded: boolean;
  public pointGraphic: __esri.Graphic;
  public markerSymbol: __esri.SimpleMarkerSymbol;
  public graphicsLayer: __esri.GraphicsLayer;

  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private esriLoader: EsriLoaderService,
  ) {}

  public buildMap() {
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
            }
          );
      });
  }

}
