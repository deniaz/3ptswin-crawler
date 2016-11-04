#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error, connection) {
  connection.createChannel(function(error, channel) {
    var queue = 'tasks';
    var msg = process.argv.slice(2).join(' ') || 'Empty Message.';

    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });

    console.log(" [x] Sent %s", msg);
  });
});
