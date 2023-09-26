import { defineStore } from 'pinia'
import { map, geoJSON, tileLayer, Map } from 'leaflet'
import type { MapOptions, LatLngExpression } from 'leaflet'
import { ref } from 'vue'

type OptionalMap =  Map | null


const mapGuard = (obj: any): obj is Map => {
  return obj != null && obj instanceof Map
}

export const useMapStore = defineStore('map', ()=>{
    const mapRef = ref<OptionalMap>(null)

    function init() {
      const options: MapOptions = {
          center: { lat: 50.4501, lng:30.5234 },
          zoom: 14,
      };
      mapRef.value = map('map', options)
      const m = mapRef.value
      if (mapGuard(m)) {
        tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(m);
        getRailInfo()
      }
    }

    function getRailInfo(){
      const m = mapRef.value
      if (mapGuard(m)) {
        fetch("/api/railroads/")
          .then(response => response.json().then(data => {
            const gjson = geoJSON(data)
            m.addLayer(gjson)
          }))
        }
    } 

    function focus(latlng: LatLngExpression, zoom: number){
      const m = mapRef.value
      if (mapGuard(m)) {
        m.setView(latlng, zoom);
      }
    }
    return { map, mapGuard, init, getRailInfo, focus }
})