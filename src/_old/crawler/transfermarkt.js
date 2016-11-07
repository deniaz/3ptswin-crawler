// @flow

import { HttpClient } from '../network/http-client';
import { TransfermarktParser } from '../parser/transfermarkt';
import type { Team } from '../flow-typed';

export default class TransfermarktCrawler {
    static baseUrl = 'http://www.transfermarkt.com';
    static tableBasePath = '/raiffeisen-super-league/tabelle/wettbewerb/C1/saison_id/';
    static fixturesBasePath = '/raiffeisen-super-league/gesamtspielplan/wettbewerb/C1/saison_id/';

    season: string;

    client: HttpClient;

    parser: TransfermarktParser;

    constructor (client: HttpClient, parser: TransfermarktParser, season: string) {
        this.season = season;
        this.parser = parser;
        this.client = client;
    }

    async getAllTeams (): Promise<any> {
        const url = `${TransfermarktCrawler.baseUrl}${TransfermarktCrawler.tableBasePath}${this.season}`;
        const page = await this.client.get(url);
        const teams = this.parser.parseTeams(page);

        return teams;
    }

    async getPlayedMatches (): Promise<any> {
        const url = `${TransfermarktCrawler.baseUrl}${TransfermarktCrawler.fixturesBasePath}${this.season}`;
        const page = await this.client.get(url);
        const fixtures = this.parser.parseFixtures(page);

        return fixtures;
    }

    async getAllPlayersByTeam (team: Team): Promise<any> {
        const url = `${TransfermarktCrawler.baseUrl}${team.url.replace('spielplan', 'kader')}`;
        const page = await this.client.get(url);
        const players = this.parser.parsePlayers(page, team.id);

        console.log(`Fetched ${players.length} players for ${team.name}`);

        return players;
    }
}
