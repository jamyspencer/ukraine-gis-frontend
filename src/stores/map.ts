import { defineStore } from 'pinia'
import { map, latLng, tileLayer, MapOptions, LatLngExpression } from 'leaflet'

export const useMapStore = defineStore('map', {
    state: () => ({ map: null }),
    actions:{
      init() {
        const options: MapOptions = {
            center: { lat: 40.731253, lng:-73.996139 },
            zoom: 12,
        };
        this.map = map('map').setView([51.505, -0.09], 13)
        tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
      },
      focus(latlng: LatLngExpression, zoom: Number){
        this.map.setView(latlng, zoom);
      }
    }
  })