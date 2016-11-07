// @flow

import { parseCompetitionData, parseCompetitionLinks } from './competition';
import { parseClubData, parseClubLinks } from './club';
import { parsePlayerData, parsePlayerLinks } from './player';


export const getParser = (key: string): Object => {
    return parsers[key];
};

const parsers = {
    competition: {
        dataParser: parseCompetitionData,
        linkParser: parseCompetitionLinks,
    },
    club: {
        dataParser: parseClubData,
        linkParser: parseClubLinks,
    },
    player: {
        dataParser: parsePlayerData,
        linkParser: parsePlayerLinks,
    }
};
