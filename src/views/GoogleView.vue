<template>
  <div
    id="map"
    class="map" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

export default defineComponent({
  setup() {

    const loader = new Loader({
      apiKey: 'AIzaSyA5dRMkbJ6t_cQqrCIuekJd4nJyVzEeSdY',
      version: 'weekly',
      libraries: ['geometry']
    })

    const map: google.maps.Map = ref([])

    onMounted(async () => {
      await loader
        .load()
        .then(google => {
          map.value = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 32.8085988, lng: -97.1563347 },
            zoom: 12
          })
        })
        .catch(error => {
          console.log(error)
        })
        .then(function () {
          new google.maps.Marker({
            position: { lat: 32.808549, lng: -97.156345 },
            label: "helipad",
            map: map.value,
          });

          new google.maps.Marker({
            position: { lat: 32.8037823, lng: -97.1640838 },
            label: "field",
            map: map.value
          })

          //addMarker(-34.397, 150.644)

          map.value.addListener("click", (event) => {
            console.log(event.latLng.lng())
            addMarker(event.latLng.lat(), event.latLng.lng())
          })


        })
    })

    const addMarker = (lat: number, lng: number) => {

      const point1 = google.maps.geometry.spherical.computeOffset(new google.maps.LatLng(lat, lng), 5, 0)
      const point2 = google.maps.geometry.spherical.computeOffset(point1, 5, 90)
      const point3 = google.maps.geometry.spherical.computeOffset(point2, 5, 180)
      const point4 = google.maps.geometry.spherical.computeOffset(point3, 5, 270)

      const marker1: google.maps.Marker = new google.maps.Marker({
        position: { lat: point1.lat(), lng: point1.lng() },
        map: map.value
      })

      const marker2: google.maps.Marker = new google.maps.Marker({
        position: { lat: point2.lat(), lng: point2.lng() },
        map: map.value
      })

      const marker3: google.maps.Marker = new google.maps.Marker({
        position: { lat: point3.lat(), lng: point3.lng() },
        map: map.value
      })

      const marker4: google.maps.Marker = new google.maps.Marker({
        position: { lat: point4.lat(), lng: point4.lng() },
        map: map.value
      })

      let poop = {
        "action": "upload_mission",
        "payload": {
          "waypoints": [
            {
              "type": "goto",
              "lat": point1.lat(),
              "lon": point1.lng(),
              "alt": 3
            },
            {
              "type": "goto",
              "lat": point2.lat(),
              "lon": point2.lng(),
              "alt": 3
            },
            {
              "type": "goto",
              "lat": point3.lat(),
              "lon": point3.lng(),
              "alt": 3
            },
            {
              "type": "goto",
              "lat": point4.lat(),
              "lon": point4.lng(),
              "alt": 3
            }
          ]
        }
      }

      console.log(JSON.stringify(poop))

    }

    const calculateDistance = (lat1: number, lng1: number, d: number, heading: number): google.maps.LatLng => {
      const radius: number = 6378137;

      var lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/radius) + 
        Math.cos(lat1)*Math.sin(d/radius)*Math.cos(heading) );

      var lng2 = lng1 + Math.atan2(Math.sin(heading)*Math.sin(d/radius)*Math.cos(lat1), 
        Math.cos(d/radius)-Math.sin(lat1)*Math.sin(lat2));

      return new google.maps.LatLng(lat2, lng2)
      
    }

    return {
      map
    }
  },

  methods: {
    haversine_distance (mk1, mk2) {
      var R = 3958.8; // Radius of the Earth in miles
      var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
      var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
      var difflat = rlat2-rlat1; // Radian difference (latitudes)
      var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

      var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
      return d;
    },

    calculateDistance(lat1: number, lng1: number, d: number, heading: number) {
      const radius: number = 6378137;

      var lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/radius) + 
        Math.cos(lat1)*Math.sin(d/radius)*Math.cos(heading) );

      var lng2 = lng1 + Math.atan2(Math.sin(heading)*Math.sin(d/radius)*Math.cos(lat1), 
        Math.cos(d/radius)-Math.sin(lat1)*Math.sin(lat2));

      
    }

    
  }

  
})

</script>

<style scoped>
  #map {
    width: 600px;
    height: 600px;
    margin: 0;
    padding: 0;
    border: 1px solid red;
  }
</style>
