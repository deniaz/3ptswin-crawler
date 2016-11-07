// @flow

import type { Fixture, Team } from '../flow-typed'
import cheerio from 'cheerio';
import * as moment from 'moment';

export class TransfermarktParser {
    parseTeams (body: string): Team[] {
        const $ = cheerio.load(body);
        const teams = [];

        $('#main > .row > .large-8.columns > .box .responsive-table table tbody tr').each((i, el) => {
          const $tr = $(el);
          const $anchor = $tr.find('.hauptlink a.vereinprofil_tooltip');
          teams.push({
            id: $anchor.attr('id'),
            name: $anchor.text(),
            url: $anchor.attr('href')
          });
        });

        return teams;
    }

    parseFixtures (body: string) : Fixture[] {
        const $ = cheerio.load(body);
        const fixtures = [];

        $('#main > .row > .large-6.columns table tbody tr:not(.bg_blau_20)').each((i, el) => {
            const $tr = $(el);

            const result = $tr.find('td:nth-of-type(5) a').text();

            if (result !== '-:-') {
                const matchDay = $tr.find('td:nth-of-type(1) a').text().trim();
                const kickoffTime = $tr.find('td:nth-of-type(2)').text().trim();
                const date = moment.default(
                    `${matchDay} ${kickoffTime}`,
                    'MMM D, YYYY h:mm a p'
                );

                fixtures.push({
                    id: $tr.find('td:nth-of-type(5) a').attr('id'),
                    date: date.format(),
                    home: {
                        team_id: $tr.find('td:nth-of-type(3) a').attr('id'),
                        score: result.split(':')[0]
                    },
                    away: {
                        team_id: $tr.find('td:nth-of-type(7) a').attr('id'),
                        score: result.split(':')[1]
                    }
                });
            }
        });

        return fixtures;
    }

    parsePlayers (body: string, team_id: string) {
        const $ = cheerio.load(body);
        const players = [];

        $('#yw1 tbody > tr.odd, #yw1 tbody > tr.even ').each((i, el) => {
            const $tr = $(el);

            players.push({
                team_id,
                squad_number: $tr.find('.rueckennummer .rn_nummer').text(),
                id: $tr.find('.posrela table tr:nth-of-type(1) .hauptlink .hide-for-small .spielprofil_tooltip').attr('id'),
                name: $tr.find('.posrela table tr:nth-of-type(1) .hauptlink .hide-for-small .spielprofil_tooltip').text(),
                position: $tr.find('.posrela table tr:nth-of-type(2) td').text()
            })
        });

        return players;
    }
}
