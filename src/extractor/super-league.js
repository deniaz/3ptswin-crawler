// @flow

import { TransfermarktCrawler } from '../crawler';
import { HttpClient } from '../network/http-client';
import { TransfermarktParser } from '../parser/transfermarkt';

// 2015/15 All Matches, Teams and Players
export default class SuperLeagueExtractor {
    crawler: TransfermarktCrawler;

    constructor (season: string) {
        this.crawler = new TransfermarktCrawler(
            new HttpClient(),
            new TransfermarktParser(),
            season
        );
    }

    async extract () {
        const teams = await this.crawler.getAllTeams();
        const matches = await this.crawler.getPlayedMatches();

        const players = await Promise.all(teams.map(async (team) => {
            const squad = await this.crawler.getAllPlayersByTeam(team);
            return squad;
        }));

        return {
            teams,
            matches,
            players
        };

    }
}
