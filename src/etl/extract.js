// @flow

import { crawl, log } from '../utils';
import { dispatch } from './dispatcher';
import { getParser } from '../parser';

import type { ExtractMessage } from '../flow-typed';

function extractRelevantLinks (body: string): string[] {
    const parser = getParser('table').links;
    return parser(body);
}

function extractRelevantData (body: string): any {
    const parser = getParser('table').data;
    return parser(body);
}

function hasExpired (url: string): boolean {
    // Check with Redis when url was last crawled and decide whether recrawling
    // is needed. TM sends a stupid Expires header, so a custom TTL is needed.
    //
    return true;
}

function postponeExpiry (url: string): void {
    // Update redis URL with a new expiry
}

export const extract = async (url: ExtractMessage) => {
    if (hasExpired(url)) {
        const page = await crawl(url);
        const links = extractRelevantLinks(page);
        const data = extractRelevantData(page);

        postponeExpiry(url);

        dispatch({
            type: 'transform',
            content: data,
        });

        // if (links.length > 0) {
        //     links.map((link) => {
        //         dispatch({
        //             type: 'extract',
        //             content: link
        //         })
        //     })
        // }

        // if (data) {
        //     data.map((node) => {
        //         dispatch({
        //             type: 'load',
        //             content: node
        //         })
        //     })
        // }

        log(`Successfully extracted ${url}.`);
    }
};
