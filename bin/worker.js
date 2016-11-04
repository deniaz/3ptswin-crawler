#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error, connection) {
  connection.createChannel(function(error, channel) {
    var queue = 'tasks';

    channel.prefetch(1);
    channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(() => {
        console.log(" [x] Done.");
        channel.ack(msg);
       }, secs * 1000);
    }, { noAck: false });
  });
});
