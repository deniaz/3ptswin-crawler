// @flow

import { dispatch } from './dispatcher';
import { createLoad } from './factory';
import { log, error } from '../utils';

import type { TransformMessage, NodeLoadMessage } from '../flow-typed';

const handlers = {
    competition: (data) => {
        const { competition } = data;
        data.clubs.map((club) => {
            const node: NodeLoadMessage = {
                label: 'Club',
                properties: {
                    id: club.id,
                    name: club.name,
                },
                relationships: [{
                    object: {
                        label: 'Competition',
                        properties: {
                            id: competition.id,
                        },
                    },
                    relationship: {
                        type: 'COMPETE_IN',
                        properties: { season: competition.season }
                    }
                }],
            };

            log(`Transformed ${club.name} data.`);
            dispatch(createLoad('node', node));
        });
    },
    club: (data) => {
        const { club } = data;
        data.players.map((player) => {
            const node: NodeLoadMessage = {
                label: 'Player',
                properties: {
                    id: player.id,
                    name: player.name,
                },
                relationships: [{
                    object: {
                        label: 'Club',
                        properties: { id: club.id },
                    },
                    relationship: {
                        type: 'PLAYS_FOR'
                    }
                }]
            };

            log(`Transformed ${player.name} data.`);
            dispatch(createLoad('node', node));
        });
    },
    player: (data) => {
        const node: NodeLoadMessage = {
            label: 'Player',
            properties: {
                id: data.player.id,
                number: data.player.number,
                name: data.player.name,
                last_name: data.player.last_name,
                first_name: data.player.first_name,
                position: data.player.position,
                birthday: data.player.birthday,
                height: data.player.height.replace(',', '').replace('m', '').trim(),
                foot: data.player.foot,
            }
        };

        log(`Transformed ${data.player.last_name} detail data.`);
        dispatch(createLoad('node', node));
    }
};

export const transform = (object: TransformMessage): void => {
    if (!object.type) {
        error('Object without type');
        return;
    }
    const handler = handlers[object.type];
    if (handler) {
        handler(object.data);
    }
};
