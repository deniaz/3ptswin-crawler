// @flow
import { crawl, dispatch } from './utils';

function extractRelevantLinks (page: string): string[] {
    // Scraping a[href=""],
}

function extractRelevantData (page: string): any {
    // Extract JSON from page
}

function hasExpired (url: string): boolean {
    // Check with Redis when url was last crawled and decide whether recrawling
    // is needed. TM sends a stupid Expires header, so a custom TTL is needed.
}

function postponeExpiry (url: string): void {
    // Update redis URL with a new expiry
}

export const extract = (url) => {
    if (hasExpired(url)) {
        const page = crawl(url);
        const links = extractRelevantLinks(page);
        const data = extractRelevantData(page);

        postponeExpiry(url);

        links.map((link) => dispatch(extract(link)));
        if (data) {
            dispatch(transform(data));
        }
    }
};
