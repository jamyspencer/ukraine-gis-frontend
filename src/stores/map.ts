import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { OSM } from 'ol/source'
import {  fromLonLat } from 'ol/proj'
import Layer from 'ol/layer/Layer'
import BaseLayer from 'ol/layer/Base'
import LayerGroup from 'ol/layer/Group'
type OptionalMap =  Map | null

const mapGuard = (obj: any): obj is Map => {
  return obj != null && obj instanceof Map
}

export const useMapStore = defineStore('map', ()=>{
  const map = ref<OptionalMap>(null)
  const group = new LayerGroup({ layers:[new TileLayer( {source: new OSM()})]} )
  const overlayLayers = ref<Array<Layer>>([])

  async function init() {
    map.value = new Map({
      target: 'map-container',
      layers: group,
      view: new View({
        center: fromLonLat([32,48]),
        zoom: 6,
      }),
    });
  }
/*
  async function getRailInfo(m: Map){
    const response = await fetch("/api/railroads/")

    if (response.ok) {
      const data = await response.json()
      const gjson = geoJSON(data, {
        onEachFeature: (feature, layer) => layer.bindPopup(feature.properties.exs_descri),
        style: feature => {
          if (feature != null && feature.properties.exs_descri != null ) {
            if ( "Operational" != feature.properties.exs_descri ) {
              return {color: "#d9534f"}
            } 
          }
          return {color: "#428bca"}
        }
      })
      overlays.value["railroads"] = gjson
      m.addLayer(gjson)
    }
  }

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