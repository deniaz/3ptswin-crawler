// @flow

import { parseClubs, parseTableLinks } from './table';

export const getParser = (criteria: any) => {
    return parsers[criteria];
};

const parsers = {
    table: {
        data: parseClubs,
        links: parseTableLinks
    },
};
