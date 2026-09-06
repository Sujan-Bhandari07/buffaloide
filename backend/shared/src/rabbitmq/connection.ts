import amqp, { type Channel } from 'amqplib'



let channel: Channel

export async function connectRabbitMQ(): Promise<Channel> {
  const connection = await amqp.connect(process.env.RABBITMQ_URL as string)
  channel = await connection.createChannel()
  console.log('RabbitMQ connected')
  return channel
}

export function getChannel(): Channel {
  if (!channel) throw new Error('RabbitMQ channel not initialized')
  return channel
}



