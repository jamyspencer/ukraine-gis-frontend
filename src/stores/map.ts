import { defineStore } from 'pinia'
import { map, geoJSON, tileLayer, control, Map } from 'leaflet'
import type { MapOptions, LatLngExpression, Control } from 'leaflet'
import { ref } from 'vue'

type OptionalMap =  Map | null


const mapGuard = (obj: any): obj is Map => {
  return obj != null && obj instanceof Map
}

export const useMapStore = defineStore('map', ()=>{
    const mapRef = ref<OptionalMap>(null)
    const overlays = ref<Control.LayersObject>({})
    const baselayers = ref<Control.LayersObject>({})

    async function init() {
      const options: MapOptions = {
          center: { lat: 49, lng:30.5234 },
          zoom: 6,
      };
      mapRef.value = map('map', options)
      const m = mapRef.value
      if (mapGuard(m)) {
        const osm = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
        baselayers.value["Open Street Map"] = osm
        m.addLayer(osm)
        
        // Using promsie.all to future proof for multiple datasets
        Promise.all([getRailInfo(m)]).then(_ => manageControlLayers(m))
      }
    }

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
    }
    return { map, mapGuard, init, getRailInfo, focus }
})