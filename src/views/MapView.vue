<template>
  <GMapMap ref="myMapRef" :center="{ lat: 51.093048, lng: 6.842120 }" :zoom="7" map-type-id="terrain"
    style="width: 100vw; height: 900px">
  </GMapMap>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
// @ts-ignore
import * as mqtt from 'mqtt/dist/mqtt.min'

export default defineComponent({
  setup() {
    const myMapRef = ref()
    const markerRef = ref()
    let markers = reactive([]);
    const center = { lat: 32.8085988, lng: -97.1563347 }
    const markerOptions = {}
    let client: mqtt
    let lat: Number
    let lng: Number

    const publishLocation = () => {
      client.publish('location', JSON.stringify({ lat: lat, lng: lng }))
    }

    onMounted(() => {
      client = mqtt.connect('ws://192.168.86.41:9001')
      client.subscribe('gps')
      client.on('connect', () => {
        console.log('connected')
      })

      // client.on('message', (topic: string, message: string) => {
      //   const decoded = new TextDecoder('utf-8').decode(message)
      //   const payload = JSON.parse(decoded).payload

      //   console.log(payload.lat)

      //   markerRef.value.marker.setPosition(new google.maps.LatLng(payload.lat, payload.lon))
      // })
    })

    return { center }
  }
})
</script>
