import { getChannel } from "./connection.js"


export async function publishMessage<T>(exchange: string, routingKey: string, data: T) {
  const channel = getChannel()
  await channel.assertExchange(exchange, 'direct', { durable: true })
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)),{
    persistent:true
  })
}