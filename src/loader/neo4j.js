// @flow

import neo4j from 'neo4j';
import _ from 'underscore';

export default class Neo4jLoader {
    db: any;

    constructor () {
        this.db = new neo4j.GraphDatabase('http://neo4j:19017189@localhost:7474');
    }

    async load (object: any) {
        // const totalPlayers = object.players.reduce((pre, cur) => { return pre + cur.length; }, 0);
        // console.info(`Importing ${totalPlayers} players.`);

        const createClubQueries = object.teams.map((team) => {
            return {
                query: 'CREATE UNIQUE (c:Club { id: {id}, name: {name} })',
                params: {
                    id: parseInt(team.id, 10),
                    name: team.name
                },
                lean: true
            };
        });

        const createPlayerQueries = _.flatten(object.players).map((player) => {
            return {
                query: 'CREATE UNIQUE ((p:Player { id: {id}, name: {name}, squad_no: {no}, position: {position} }))',
                params: {
                    id: parseInt(player.id, 10),
                    name: player.name,
                    no: parseInt(player.squad_number, 10),
                    position: player.position,
                },
                lean: true
            }
        });

        this.db.cypher({
            queries: [
                {
                    query: "CREATE UNIQUE (s:Season { id: 2015, name: '2015/16' })",
                    lean: true,
                },
                {
                    query: "CREATE UNIQUE (c1:Competition { name: 'Raiffeisen Super League' })",
                    lean: true
                }
            ].concat(createClubQueries, createPlayerQueries),
        }, (err, batchResults) => {
            if (err) {
                console.log('Neo4j Batch Failed.');
                return;
            }

            console.log('Stored Clubs.');

            this.db.cypher({
                queries: _.flatten(object.players).map((player) => {
                    if (isNaN(player.id) || isNaN(player.team_id)) {
                        console.info(`${player.name} unmappable.`);
                    }

                    return {
                        query: 'MATCH (p:Player { id: {id} }), (c:Club { id: {team_id} }) CREATE (p)-[:PLAYS_FOR]->(c)',
                        params: {
                            id: parseInt(player.id, 10),
                            team_id: parseInt(player.team_id, 10)
                        },
                        lean: true
                    };
                })
            }, (err, batchResults) => {
                if (err) {
                    console.log('Neo4j Batch Failed.');
                    return;
                }

                console.log('Stored Relations.');
            });
        });
    }
}
