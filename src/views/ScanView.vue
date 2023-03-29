<template>
    <div>
        <button @click="captureHome">Capture Home Location</button>&nbsp;
        <button @click="flyScanPattern">Fly Scan Pattern</button>&nbsp;
        <button @click="goHome">Go Home</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
// @ts-ignore
import * as mqtt from 'mqtt/dist/mqtt.min'

export default defineComponent({

    setup() {

        let client: mqtt

        console.log('setting up')


        onMounted(() => {
            client = mqtt.connect('ws://192.168.86.45:9001')
            client.subscribe('gps')
            client.on('connect', () => {
                console.log('connected')
            })

            client.on('message', (topic: string, message: string) => {
                const decoded = new TextDecoder('utf-8').decode(message)
                const payload = JSON.parse(decoded).payload
                console.log(payload.lat)
            })
        })

        const captureHome = () => {
            client.publish('avr/fcm/capture_home', JSON.stringify({}))
        }

        const flyScanPattern = async () => {

            const leg1 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 5, "e": 0, "d": -3, "heading": 0 } })
            const leg2 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 5, "e": 5, "d": -3, "heading": 0 } })
            const leg3 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 10, "e": 5, "d": -3, "heading": 0 } })
            const leg4 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 10, "e": 0, "d": -3, "heading": 0 } })
            const leg5 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 15, "e": 0, "d": -3, "heading": 0 } })
            const leg6 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 15, "e": 5, "d": -3, "heading": 0 } })

            client.publish("avr/fcm/actions", leg1)
            await wait(5000)
            client.publish("avr/fcm/actions", leg2)
            await wait(5000)
            client.publish("avr/fcm/actions", leg3)
            await wait(5000)
            client.publish("avr/fcm/actions", leg4)
            await wait(5000)
            client.publish("avr/fcm/actions", leg5)
            await wait(5000)

        }

        const goHome = () => {
            const home = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 0, "e": 0, "d": -3, "heading": 0 } })
            client.publish("avr/fcm/actions", home)

        }

        const wait = async (milliseconds: number) => {
            return new Promise(resolve => { setTimeout(resolve, milliseconds); })
        }

        return {
            captureHome,
            flyScanPattern,
            goHome
        }
    }


})
</script>
<style></style>