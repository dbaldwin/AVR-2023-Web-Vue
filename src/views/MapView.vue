<template>
  <GoogleMap
    api-key="AIzaSyA5dRMkbJ6t_cQqrCIuekJd4nJyVzEeSdY"
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="15"
    @click="setMarker"
  >
    <Marker :options="markerOptions" ref="markerRef" />
  </GoogleMap>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import * as mqtt from 'mqtt/dist/mqtt.min'

export default defineComponent({
  components: { GoogleMap, Marker },
  setup() {
    const markerRef = ref()
    const center = { lat: 40.689247, lng: -74.044502 }
    const markerOptions = { position: center, label: 'L', title: 'LADY LIBERTY' }
    let client: mqtt
    let lat: Number
    let lng: Number

    const setMarker = (event) => {
      lat = event.latLng.lat()
      lng = event.latLng.lng()
      markerRef.value.marker.setPosition(new google.maps.LatLng(lat, lng))
      console.log(`${lat}, ${lng}`)
    }

    const publishLocation = () => {
      client.publish('location', JSON.stringify({ lat: lat, lng: lng }))
    }

    onMounted(() => {
      client = mqtt.connect('ws://192.168.86.41:9001')
      client.subscribe('gps')
      client.on('connect', () => {
        console.log('connected')
      })

      client.on('message', (topic: string, message: string) => {
        const decoded = new TextDecoder('utf-8').decode(message)
        const payload = JSON.parse(decoded).payload

        console.log(payload.lat)

        markerRef.value.marker.setPosition(new google.maps.LatLng(payload.lat, payload.lon))
      })
    })

    return { center, markerOptions, markerRef, setMarker }
  }
})
</script>
