import { defineStore } from 'pinia'
import { map, geoJSON, tileLayer, MapOptions, LatLngExpression, Map } from 'leaflet'

type OptionalMap = Map | null

export const useMapStore = defineStore('map', {
    state: () => ({ map: null as OptionalMap }),
    actions:{
      init() {
        const options: MapOptions = {
            center: { lat: 50.4501, lng:30.5234 },
            zoom: 12,
        };
        this.map = map('map', options)
        tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
        this.getRailInfo()
      },
      getRailInfo(){
        if (this.map != null) {
          const mapRef = this.map
          fetch("/api/railroads/")
            .then(response => response.json().then(data => {
              const gjson = geoJSON(data)
              mapRef.addLayer(gjson)
            }))
          }
      },
      focus(latlng: LatLngExpression, zoom: Number){
        this.map.setView(latlng, zoom);
      }
    }
  })