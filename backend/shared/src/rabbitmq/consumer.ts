
import { getChannel } from './connection.js'

export async function consumeMessages<T>(
  exchange: string,
  routingKey: string,
  queue: string,
  onMessage: (data: T) =>Promise<void>| void
) {
  const channel = getChannel()
  await channel.assertExchange(exchange, 'direct', { durable: true })
  await channel.assertQueue(queue, { durable: true })
  await channel.bindQueue(queue, exchange, routingKey)

  channel.consume(queue,async (msg) => {
    if (!msg) return
    try {
      const data = JSON.parse(msg.content.toString()) as T
      
    await onMessage(data)
    channel.ack(msg)
    } catch (error) {
      console.error('Failed to process message:', error)
    channel.nack(msg, false, false) 
    }

  })
}