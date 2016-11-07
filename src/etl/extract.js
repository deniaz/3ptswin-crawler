// @flow

import { crawl, log, error } from '../utils';
import { dispatch } from './dispatcher';
import { getParser } from '../parser';

import type { ExtractMessage } from '../flow-typed';

function hasExpired (url: string): boolean {
    // Check with Redis when url was last crawled and decide whether recrawling
    // is needed. TM sends a stupid Expires header, so a custom TTL is needed.
    //
    return true;
}

function postponeExpiry (url: string): void {
    // Update redis URL with a new expiry
}

function getLinkExtractor (pageType: string) {
    const parser = getParser(pageType).linkParser;
    return parser;
}

function getDataExtractor (pageType: string) {
    const parser = getParser(pageType).dataParser;
    return parser;
}

export const extract = async (message: ExtractMessage) => {
    const { url, pageType } = message;

    if (hasExpired(url)) {
        const extractRelevantLinks = getLinkExtractor(pageType);
        const extractRelevantData = getDataExtractor(pageType);

        if (!extractRelevantLinks && !extractRelevantData) {
            error(`No parser found for ${pageType}`);
            return;
        }

        const page = await crawl(url);
        postponeExpiry(url);

        if (extractRelevantData) {
            const data = extractRelevantData(page);
            dispatch({
                type: 'transform',
                content: data,
            });

            log(`Successfully extracted ${url}`);
        }

        if (extractRelevantLinks) {
            const links = extractRelevantLinks(page);

            if (!links) {
                error(`No follow-up links on ${url}`);
                return;
            }

            if (links && links.length > 0) {
                links.map((link, i) => {
                    setTimeout(() => {
                        dispatch({
                            type: 'extract',
                            content: link
                        });
                    }, (500 * (i+1)));
                });
            }
        }

    }
};
