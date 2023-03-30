<template>
    <div>
        <button @click="captureHome">Capture Home Location</button>&nbsp;
        <button @click="takeOff">Takeoff</button>&nbsp;
        <button @click="flyScanPattern">Fly Scan Pattern</button>&nbsp;
        <button @click="land">Land</button>&nbsp;
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
            client = mqtt.connect(`ws://${location.hostname}:9001`)
            client.subscribe('gps')
            client.on('connect', () => {
                console.log('connected')
            })
            // client.on('message', (topic: string, message: string) => {
            //     const decoded = new TextDecoder('utf-8').decode(message)
            //     const payload = JSON.parse(decoded).payload
            //     console.log(payload.lat)
            // })
        })

        const captureHome = () => {
            client.publish('avr/fcm/capture_home', JSON.stringify({}))
        }

        const takeOff = () => {
            client.publish('avr/fcm/actions', JSON.stringify({ "action": "takeoff", "payload": { "alt": 5 } }))
        }

        const land = () => {
            console.log('land')
            client.publish('avr/fcm/actions', JSON.stringify({ "action": "land", "payload": {} }))
        }


        const flyScanPattern = async () => {

            const forward = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 0.1, "e": 0, "d": 0, "rel": true, "heading": 0 } })
            const right = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 0, "e": 0.1, "d": 0, "rel": true, "heading": 0 } })
            const left = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 0, "e": -0.1, "d": 0, "rel": true, "heading": 0 } })

            const commands = [forward, right, forward, left, forward, right, forward, left, forward, right, forward, left, forward];

            for await (const command of commands) {
                client.publish("avr/fcm/actions", command);
                console.log(command);
                await wait(5000);
            }

            // const leg2 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 5, "e": 5, "d": -3, "rel": 1, "heading": 0 } })
            // const leg3 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 10, "e": 5, "d": -3, "rel": 1, "heading": 0 } })
            // const leg4 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 10, "e": 0, "d": -3, "rel": 1, "heading": 0 } })
            // const leg5 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 15, "e": 0, "d": -3, "rel": 1, "heading": 0 } })
            // const leg6 = JSON.stringify({ "action": "goto_location_ned", "payload": { "n": 15, "e": 5, "d": -3, "rel": 1, "heading": 0 } })


            // await wait(5000)
            // client.publish("avr/fcm/actions", leg2)
            // await wait(5000)
            // client.publish("avr/fcm/actions", leg3)
            // await wait(5000)
            // client.publish("avr/fcm/actions", leg4)
            // await wait(5000)
            // client.publish("avr/fcm/actions", leg5)
            // await wait(5000)

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
            takeOff,
            flyScanPattern,
            land,
            goHome
        }
    }


})
</script>
<style></style>