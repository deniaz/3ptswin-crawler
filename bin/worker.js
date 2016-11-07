#!/usr/bin/env node

import { extract, transform, load } from '../src';

const amqp = require('amqplib/callback_api');
const connection = 'amqp://localhost'; // move to .env

const exchange = '3ptswin';
const type = process.argv[2];

const handlers = {
    extract,
    transform,
    load
};

const handler = handlers[type];

if (!handler) {
    console.log(`No handler found for type ${type}. Please choose between extract, transform or load.`);
    process.exit(1);
}

amqp.connect(connection, (error, connection) => {
    connection.createChannel((error, channel) => {
        channel.assertExchange(exchange, 'direct', { durable: true });
        // channel.prefetch(1);
        channel.assertQueue('', { exclusive: true }, (error, queue) => {
            console.log(`Waiting for ${type} work. To exit press ctrl+c`);

            channel.bindQueue(queue.queue, exchange, type)
            channel.consume(queue.queue, (msg) => {
                const json = msg.content.toString();
                const content = JSON.parse(json);

                handler(content);
            }, { noAck: false });
        });
    });
});
