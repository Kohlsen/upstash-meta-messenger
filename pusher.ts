import Pusher from 'pusher'
import ClientPusher from 'pusher-js'

export const serverPusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: "us2",
    useTLS: true
})

export const clientPusher = new ClientPusher('94d7a77eb51e7530c00a', {
    cluster: 'us2',
    forceTLS: true
  });