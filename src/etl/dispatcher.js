// @flow

import amqp from 'amqplib';

const exchange = '3ptswin';
const connectionString = 'amqp://localhost'; // move to .

import type { DispatchMessage } from '../flow-typed';

export const dispatch = async (message: DispatchMessage) => {
    const connection = await amqp.connect(connectionString);
    const channel = await connection.createChannel();
    channel.assertExchange(exchange, 'direct', { durable: true });

    channel.publish(
        exchange,
        message.type,
        Buffer.from(JSON.stringify(message.content))
    );

    setTimeout(() => {
        connection.close();
    }, 500);
}
