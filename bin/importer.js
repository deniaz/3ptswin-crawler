#!/usr/bin/env node
// @flow

import { createExtract, createLoad } from '../src';
import { dispatch } from '../src';

const amqp = require('amqplib/callback_api');
const connection = 'amqp://localhost'; // move to .env

const exchange = '3ptswin';
const competitionInput = process.argv[2];
const season = process.argv[3];

const competitionMap = {
  C1: 'http://www.transfermarkt.com/raiffeisen-super-league/startseite/wettbewerb/C1/saison_id/',
}

if (!season || !competitionMap[competitionInput]) {
  console.log('Please provide valid Competition Key and Season.');
  process.exit(1);
}

const leagueTableUrl = `${competitionMap[competitionInput]}${season}`;
dispatch(createExtract(leagueTableUrl));
dispatch(createLoad('node', {
  label: 'Competition',
  properties: {
      id: 'C1',
      name: 'Raiffeisen Super League'
  }
}));

// amqp.connect(connection, (error, connection) => {
//   connection.createChannel((error, channel) => {
//     channel.assertExchange(exchange, 'direct', { durable: true });
//
//     channel.publish(exchange, 'extract', Buffer.from(JSON.stringify(createExtract(leagueTableUrl))));
//
//     channel.publish(exchange, 'load', Buffer.from(
//       JSON.stringify({
//         type: 'node',
//         content: {
//             label: 'Competition',
//             properties: {
//                 id: 'C1',
//                 name: 'Raiffeisen Super League'
//             }
//         }
//       })
//     ));
//
//     console.log(`Sent Message to start extrating ${competitionInput}`);
//   });
//
//   setTimeout(() => {
//     connection.close();
//     process.exit(0);
//   }, 500);
// });
