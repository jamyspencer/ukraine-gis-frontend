import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Feature, Map, View } from 'ol'
import { OSM, Vector as VectorSource } from 'ol/source'
import {  fromLonLat, toLonLat } from 'ol/proj'
import Layer from 'ol/layer/Layer'
import {Tile as TileLayer} from 'ol/layer';
import VectorLayer  from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'
import { Circle, LineString, MultiLineString } from 'ol/geom'
import {useGeographic} from 'ol/proj.js';
type OptionalMap =  Map | null

const mapGuard = (obj: any): obj is Map => {
  return obj != null && obj instanceof Map
}

export const useMapStore = defineStore('map', ()=>{
  const map = ref<OptionalMap>(null)
  const osm = new TileLayer( {source: new OSM()})
  const overlayLayers = ref<Array<Layer>>([])

  async function init(reload = false) {

    const rails =  await getRailInfo()
    const group = rails ? [osm,rails] : [osm]
    if (map.value == null || reload) {
      const m = new Map({
        target: 'map-container',
        layers: group,
        view: new View({
          center: fromLonLat([32,48]),
          zoom: 6,
        }),
      });
      map.value = m
    }
}

  async function getRailInfo(){
    const response = await fetch("/api/railroads/")

    if (response.ok) {
      let data = await response.json()
      const source = new VectorSource({features: (new GeoJSON()).readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })})

      return new VectorLayer({
        source,
        style: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2
          })
        })
      })
    }
  }
  /*

  function manageControlLayers(m: Map){
    const c = control.layers(baselayers.value, overlays.value)
    c.addTo(m)
  }

  function focus(latlng: LatLngExpression, zoom: number){
    const m = mapRef.value
    if (mapGuard(m)) {
      m.setView(latlng, zoom);
    }
  }*/
  return { map, mapGuard, init }
  
})