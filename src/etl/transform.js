// @flow

import { dispatch } from './dispatcher';
import { createLoad } from './factory';

import type { TransformMessage } from '../flow-typed';

export const transform = (object: TransformMessage): void => {
    if (object.competition && object.clubs) {
        const { competition } = object;
        object.clubs.map((club) => {
            const node = {
                label: 'Club',
                properties: transformClub(club)
            };

            const relationships = [{
                object: competition,
                relationship: {
                    type: 'compete in',
                    properties: { season: competition.season}
                }
            }];

            if (relationships.length > 0) {
                node.relationships = relationships;
            }

            console.log(`Transformed ${object.competition.name}'s clubs.'`);
            dispatch(createLoad('node', node));
        });
    }
};

const transformClub = (club: Object): Object => ({
    id: parseInt(club.id, 10),
    name: club.name,
});
