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
